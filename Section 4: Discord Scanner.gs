// ==========================================
// 4. DISCORD REACTION SCANNER (QUEUE TRACKING + AUTO-LEARNING)
// ==========================================
function pullDiscordOrders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var configSheet = ss.getSheetByName("Config");
  
  // --- LINK TO EXTERNAL MASTER SHEET ---
  var masterId = configSheet.getRange("B13").getDisplayValue().trim();
  var customerSheet;
  try {
    customerSheet = SpreadsheetApp.openById(masterId).getSheetByName("Customer");
  } catch(e) {
    SpreadsheetApp.getUi().alert("Could not connect to Master Customer List. Please verify the ID in Config B13.");
    return;
  }
  
  var botToken = configSheet.getRange("B9").getDisplayValue().replace(/\s/g, '');
  var rawChannel = configSheet.getRange("B10").getDisplayValue();
  var channelMatch = rawChannel.match(/\d+/g);
  var channelId = channelMatch ? channelMatch[channelMatch.length - 1] : rawChannel.trim();
  var proxyUrl = configSheet.getRange("B11").getDisplayValue().trim();
  if (proxyUrl.endsWith("/")) proxyUrl = proxyUrl.slice(0, -1);
  var formLink = configSheet.getRange("B12").getDisplayValue().trim();
  
  if (!botToken || !channelId || !proxyUrl) {
    SpreadsheetApp.getUi().alert("Missing Config info in B9, B10, or B11.");
    return;
  }
  
  SpreadsheetApp.getActiveSpreadsheet().toast("Scanning Discord & Assigning Queue Numbers...", "Discord Sync", 10);
  
  // 1. Map Valid Products (Roster Check)
  var releaseDate = sheet.getRange("B1").getDisplayValue().trim();
  var lastProdRow = sheet.getLastRow();
  if (lastProdRow < 3) return;
  var productList = sheet.getRange(3, 1, lastProdRow - 2, 1).getValues().flat();
  var validProducts = [];
  productList.forEach(name => { 
    if(name) validProducts.push(name.toString().trim()); 
  });

  // 2. Map Customers & Track Rows for Auto-Updating
  var custData = customerSheet.getRange(2, 1, Math.max(1, customerSheet.getLastRow() - 1), 4).getValues();
  var customerDict = {};
  var customerDetails = {}; 
  
  custData.forEach((row, index) => {
    var realName = row[0] ? row[0].toString().trim() : "";
    var phone = row[1] ? row[1].toString().trim() : "";
    var originalDiscord = row[2] ? row[2].toString().trim() : "";
    var rowIndex = index + 2; 
    
    var finalName = realName || originalDiscord;
    var handles = originalDiscord.toLowerCase().split(/[,\/]+/);
    
    handles.forEach(h => {
      var cleanHandle = h.trim();
      if (cleanHandle) {
        customerDict[cleanHandle] = { 
          name: finalName, 
          isMissing: (!row[0] || !row[1]),
          rowIndex: rowIndex,
          originalDiscord: originalDiscord 
        };
      }
    });

    if (finalName) {
      customerDetails[finalName] = { phone: phone, discord: originalDiscord };
    }
  });

  // 3. Fetch Discord Data
  var options = { "method": "get", "headers": { "Authorization": "Bot " + botToken }, "muteHttpExceptions": true };
  var response = UrlFetchApp.fetch(proxyUrl + "/api/v10/channels/" + channelId + "/messages?limit=100", options);
  if (response.getResponseCode() !== 200) return;
  
  var messages = JSON.parse(response.getContentText());
  var orderData = {}; 
  var listOutput = []; 
  var usersToDM = {};
  var pendingAliasUpdates = {}; 
  
  // NEW: Object to track the "Ticket Number" for each product line
  var productQueues = {};

  for (var i = 0; i < messages.length; i++) {
    var msg = messages[i];
    
    if (msg.content && msg.content.includes("🚨 **Preorders for release on")) {
      if (!msg.content.includes(releaseDate)) break; 
    }
    
    if (msg.embeds && msg.embeds[0] && msg.embeds[0].title) {
      var prodName = msg.embeds[0].title.split("  —  ")[0].trim();
      if (!validProducts.includes(prodName)) continue; 
      
      // Initialize the queue counter for this specific product if it doesn't exist
      if (!productQueues[prodName]) productQueues[prodName] = 1;
      
      if (msg.reactions) {
        msg.reactions.forEach(react => {
          var emoji = react.emoji.id ? react.emoji.name + ":" + react.emoji.id : react.emoji.name;
          var reactRes = UrlFetchApp.fetch(proxyUrl + "/api/v10/channels/" + channelId + "/messages/" + msg.id + "/reactions/" + encodeURIComponent(emoji), options);
          if (reactRes.getResponseCode() === 200) {
            
            // The API returns users in chronological order of their reaction
            JSON.parse(reactRes.getContentText()).forEach(user => {
              if (user.bot) return;
              
              var username = user.username.toLowerCase();
              var displayname = user.global_name ? user.global_name.toLowerCase() : "";
              var mappedInfo = customerDict[username] || customerDict[displayname];
              
              // --- AUTO-LEARNING ENGINE ---
              if (mappedInfo) {
                var currentDiscordStr = mappedInfo.originalDiscord.toLowerCase();
                var aliasesToAdd = [];

                if (username && !currentDiscordStr.includes(username)) aliasesToAdd.push(user.username);
                if (displayname && !currentDiscordStr.includes(displayname)) aliasesToAdd.push(user.global_name);

                if (aliasesToAdd.length > 0) {
                  var newDiscordStr = mappedInfo.originalDiscord + ", " + aliasesToAdd.join(", ");
                  mappedInfo.originalDiscord = newDiscordStr;
                  customerDetails[mappedInfo.name].discord = newDiscordStr; 
                  pendingAliasUpdates[mappedInfo.rowIndex] = newDiscordStr; 
                  aliasesToAdd.forEach(alias => { customerDict[alias.toLowerCase()] = mappedInfo; });
                }
              }

              var mapped = mappedInfo || { name: "⚠️ " + user.username, isMissing: true };
              
              if (!customerDetails[mapped.name]) {
                customerDetails[mapped.name] = { phone: "Missing Info", discord: user.username };
              }
              
              if (!orderData[mapped.name]) orderData[mapped.name] = {};
              
              // --- NEW QUEUE TRACKING LOGIC ---
              if (!orderData[mapped.name][prodName]) {
                // First time reacting to this product: Assign them the next ticket number
                orderData[mapped.name][prodName] = { 
                  qty: 1, 
                  queuePos: productQueues[prodName]++ 
                };
              } else {
                // If they reacted with multiple emojis to the same product, up the qty but keep their original spot in line
                orderData[mapped.name][prodName].qty += 1;
              }
              
              if (mapped.isMissing && formLink) usersToDM[username] = { id: user.id };
            });
          }
        });
      }
    }
  }

  var sortedCustomers = Object.keys(orderData).sort();
  if (sortedCustomers.length === 0) {
    SpreadsheetApp.getUi().alert("No current orders found.");
    return;
  }

  // --- CLEANUP & FORMATTING (Shifted for Queue Column) ---
  sheet.getRange(1, 11, sheet.getMaxRows(), sheet.getMaxColumns() - 10).clearContent().setBackground(null).setBorder(false, false, false, false, false, false);
  
  sheet.setColumnWidth(11, 150); // K: Customer
  sheet.setColumnWidth(12, 120); // L: Phone
  sheet.setColumnWidth(13, 120); // M: Discord
  sheet.setColumnWidth(14, 350); // N: Product
  sheet.setColumnWidth(15, 50);  // O: Qty
  sheet.setColumnWidth(16, 75);  // P: Queue # (NEW)
  sheet.setColumnWidth(17, 25);  // Q: Divider

  // --- VIEW A: THE EXPANDED LIST (K2:P) ---
  sortedCustomers.forEach(cust => {
    var details = customerDetails[cust];
    for (var prod in orderData[cust]) {
      var orderInfo = orderData[cust][prod];
      // Added Queue Position to the list output
      listOutput.push([cust, details.phone, details.discord, prod, orderInfo.qty, "#" + orderInfo.queuePos]); 
    }
  });
  
  var listHeaderRange = sheet.getRange(2, 11, 1, 6);
  listHeaderRange.setValues([["Customer", "Phone", "Discord", "Product", "Qty", "Queue #"]])
        .setFontWeight("bold").setBackground("#202124").setFontColor("#ffffff").setHorizontalAlignment("center");
        
  if (listOutput.length > 0) {
    var listDataRange = sheet.getRange(3, 11, listOutput.length, 6);
    listDataRange.setValues(listOutput).setVerticalAlignment("top");
    sheet.getRange(3, 14, listOutput.length, 1).setWrap(true); 
    
    // Center align the Qty and Queue columns
    sheet.getRange(3, 15, listOutput.length, 2).setHorizontalAlignment("center");
  }

  // --- COLUMN Q: THE DIVIDER ---
  sheet.getRange(2, 17, sheet.getMaxRows(), 1).setBackground("#f3f3f3");

  // --- VIEW B: THE MATRIX (R2 onwards) ---
  var matrixHeaderRange = sheet.getRange(2, 18, 1, sortedCustomers.length);
  matrixHeaderRange.setValues([sortedCustomers])
        .setFontWeight("bold").setBackground("#202124").setFontColor("#ffffff").setHorizontalAlignment("center");

  var matrixMatrix = [];
  productList.forEach(prodName => {
    var rowValues = [];
    sortedCustomers.forEach(custName => {
      // Extract just the Qty for the Matrix View
      var orderInfo = orderData[custName][prodName.toString().trim()];
      rowValues.push(orderInfo ? orderInfo.qty : ""); 
    });
    matrixMatrix.push(rowValues);
  });

  var matrixDataRange = sheet.getRange(3, 18, matrixMatrix.length, sortedCustomers.length);
  matrixDataRange.setValues(matrixMatrix).setHorizontalAlignment("center");
  sheet.autoResizeColumns(18, sortedCustomers.length);

  // --- UPDATE FORMULA IN COLUMN C (Now tracking from R) ---
  var lastColLetter = sheet.getRange(1, 17 + sortedCustomers.length).getA1Notation().split('1')[0];
  sheet.getRange("C3").setFormula('=ARRAYFORMULA(IF(A3:A="", "", BYROW(R3:' + lastColLetter + ', lambda(row, SUM(row)))))');

  // --- WRITE ALIAS UPDATES TO MASTER SHEET ---
  var learnedCount = 0;
  for (var rIndex in pendingAliasUpdates) {
    customerSheet.getRange(parseInt(rIndex), 3).setValue(pendingAliasUpdates[rIndex]);
    learnedCount++;
  }

  // --- DM LOGIC ---
  var dmCount = 0;
  for (var dmHandle in usersToDM) {
    var id = usersToDM[dmHandle].id;
    var openRes = UrlFetchApp.fetch(proxyUrl + "/api/v10/users/@me/channels", {
      "method": "post", "contentType": "application/json", "headers": { "Authorization": "Bot " + botToken },
      "payload": JSON.stringify({ "recipient_id": id.toString() }), "muteHttpExceptions": true
    });
    if (openRes.getResponseCode() === 200 || openRes.getResponseCode() === 201) {
      var chan = JSON.parse(openRes.getContentText());
      var msgPayload = JSON.stringify({ "content": "👋 Hi! We saw your preorder at Hobby Corner. Please fill out this form so we can save your items: " + formLink });
      UrlFetchApp.fetch(proxyUrl + "/api/v10/channels/" + chan.id + "/messages", {
        "method": "post", "contentType": "application/json", "headers": { "Authorization": "Bot " + botToken },
        "payload": msgPayload, "muteHttpExceptions": true
      });
      dmCount++;
    }
    Utilities.sleep(1000);
  }

  SpreadsheetApp.getUi().alert("Sync Complete!\nMatrix built.\nQueue # column added to track order priority.");
}