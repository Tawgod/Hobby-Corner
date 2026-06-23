// ==========================================
// 4. DISCORD REACTION SCANNER (CAPPED FORMULAS + ARCHIVE SAFE + LIMIT HIGHLIGHTING)
// ==========================================
function pullDiscordOrders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var configSheet = ss.getSheetByName("Config");
  
  var masterId = configSheet.getRange("B4").getDisplayValue().trim();
  var customerSheet;
  try {
    customerSheet = SpreadsheetApp.openById(masterId).getSheetByName("Customer");
  } catch(e) {
    SpreadsheetApp.getUi().alert("Could not connect to Master Customer List. Please verify the ID in Config B4.");
    return;
  }
  
  var botToken = configSheet.getRange("B1").getDisplayValue().replace(/\s/g, '');
  var proxyUrl = configSheet.getRange("B2").getDisplayValue().trim();
  if (proxyUrl.endsWith("/")) proxyUrl = proxyUrl.slice(0, -1);
  var formLink = configSheet.getRange("B3").getDisplayValue().trim();
  
  var tcgType = sheet.getRange("B1").getValue().toString().toLowerCase();
  var channelIdStr = "";
  if (tcgType.includes("pokemon")) channelIdStr = configSheet.getRange("B6").getDisplayValue();
  else if (tcgType.includes("mtg") || tcgType.includes("magic")) channelIdStr = configSheet.getRange("B7").getDisplayValue();
  else channelIdStr = configSheet.getRange("B8").getDisplayValue();

  var channelMatch = channelIdStr.match(/\d+/g);
  var channelId = channelMatch ? channelMatch[channelMatch.length - 1] : channelIdStr.trim();

  if (!botToken || !channelId || !proxyUrl) {
    SpreadsheetApp.getUi().alert("Missing Config info: Bot Token, Proxy URL, or Channel ID.");
    return;
  }
  
  SpreadsheetApp.getActiveSpreadsheet().toast("Scanning Discord & Assigning Queue Numbers...", "Discord Sync", 10);
  
  // 1. Map Valid Products & Limits (BOUNDED TO AVOID ARCHIVES IN COLUMN A)
  var dueDate = sheet.getRange("E1").getDisplayValue().trim();
  
  var aValues = sheet.getRange("A:A").getValues();
  var bValues = sheet.getRange("B:B").getValues();
  var lastProdRow = 0;
  var archiveHeaderRow = -1;
  
  // Dynamically find where the products end and the archive begins
  for (var i = 0; i < aValues.length; i++) {
    if (aValues[i][0] === "ARCHIVED PREORDERS") {
      archiveHeaderRow = i + 1;
      break;
    }
    if (bValues[i][0] !== "") lastProdRow = i + 1;
  }

  if (lastProdRow < 3) return;
  
  var prodDataRange = sheet.getRange(3, 2, lastProdRow - 2, 3).getValues(); 
  var validProducts = [];
  var productLimits = {};
  
  prodDataRange.forEach(row => {
    var name = row[0] ? row[0].toString().trim() : null;
    var limit = row[2]; 
    if (name) {
      validProducts.push(name);
      productLimits[name] = (limit !== "" && !isNaN(limit) && limit > 0) ? parseInt(limit) : Infinity;
    }
  });

  // 2. Map Customers
  var custData = customerSheet.getRange(2, 1, Math.max(1, customerSheet.getLastRow() - 1), 4).getValues();
  var customerDict = {};
  var customerDetails = {}; 
  
  custData.forEach((row, index) => {
    var realName = row[0] ? row[0].toString().trim() : "";
    var phone = row[1] ? row[1].toString().trim() : "";
    var originalDiscord = row[2] ? row[2].toString().trim() : "";
    var finalName = realName || originalDiscord;
    
    originalDiscord.toLowerCase().split(/[,\/]+/).forEach(h => {
      if (h.trim()) {
        customerDict[h.trim()] = { name: finalName, isMissing: (!row[0] || !row[1]), rowIndex: index + 2, originalDiscord: originalDiscord };
      }
    });

    if (finalName) customerDetails[finalName] = { phone: phone, discord: originalDiscord, id: "" };
  });

  // 3. Preserve Existing "Allocated" Checkboxes
  var activeListMaxRow = sheet.getLastRow();
  var listDataRange = sheet.getRange("K3:R" + Math.max(3, activeListMaxRow)).getValues();
  var preservedChecks = {};
  
  for (var r = 0; r < listDataRange.length; r++) {
    if (listDataRange[r][0] === true) {
      var custKey = listDataRange[r][1]; // Customer
      var prodKey = listDataRange[r][5]; // Product
      preservedChecks[custKey + "|" + prodKey] = true;
    }
  }

  // 4. Fetch Discord Data
  var options = { "method": "get", "headers": { "Authorization": "Bot " + botToken }, "muteHttpExceptions": true };
  var response = UrlFetchApp.fetch(proxyUrl + "/api/v10/channels/" + channelId + "/messages?limit=100", options);
  if (response.getResponseCode() !== 200) return;
  
  var messages = JSON.parse(response.getContentText());
  var orderData = {}; 
  var usersToDM = {};
  var productQueues = {};

  for (var i = 0; i < messages.length; i++) {
    var msg = messages[i];
    if (msg.content && msg.content.includes("🚨 **New") && !msg.content.includes(dueDate)) break; 
    
    if (msg.embeds && msg.embeds[0] && msg.embeds[0].title) {
      var prodName = msg.embeds[0].title.split("  —  ")[0].trim();
      if (!validProducts.includes(prodName)) continue; 
      if (!productQueues[prodName]) productQueues[prodName] = 1;
      
      if (msg.reactions) {
        msg.reactions.forEach(react => {
          var emoji = react.emoji.id ? react.emoji.name + ":" + react.emoji.id : react.emoji.name;
          var reactRes = UrlFetchApp.fetch(proxyUrl + "/api/v10/channels/" + channelId + "/messages/" + msg.id + "/reactions/" + encodeURIComponent(emoji), options);
          if (reactRes.getResponseCode() === 200) {
            JSON.parse(reactRes.getContentText()).forEach(user => {
              if (user.bot) return;
              
              var mappedInfo = customerDict[user.username.toLowerCase()] || customerDict[user.global_name ? user.global_name.toLowerCase() : ""];
              var mapped = mappedInfo || { name: "⚠️ " + user.username, isMissing: true };
              
              if (!customerDetails[mapped.name]) customerDetails[mapped.name] = { phone: "Missing Info", discord: user.username, id: user.id };
              else if (!customerDetails[mapped.name].id) customerDetails[mapped.name].id = user.id; // Store Discord ID
              
              if (!orderData[mapped.name]) orderData[mapped.name] = {};
              
              // --- LIMIT CAP TRACKING ---
              if (!orderData[mapped.name][prodName]) {
                orderData[mapped.name][prodName] = { qty: 1, queuePos: productQueues[prodName]++, hitLimit: false };
              } else if (orderData[mapped.name][prodName].qty < productLimits[prodName]) {
                orderData[mapped.name][prodName].qty += 1;
              } else {
                orderData[mapped.name][prodName].hitLimit = true;
              }
              
              if (mapped.isMissing && formLink) usersToDM[user.username.toLowerCase()] = { id: user.id };
            });
          }
        });
      }
    }
  }

  var sortedCustomers = Object.keys(orderData).sort();
  if (sortedCustomers.length === 0) return SpreadsheetApp.getUi().alert("No current orders found.");

  // --- CLEANUP & FORMATTING ---
  // Setup I & J for Inventory tracking 
  sheet.getRange(2, 9, 1, 2).setValues([["Received", "Remaining"]]).setFontWeight("bold").setBackground("#202124").setFontColor("#ffffff");
  
  // CLEAR AND CAP J FORMULA TO ROW 33
  sheet.getRange("J3:J" + sheet.getMaxRows()).clearContent();
  for(var r=3; r<=33; r++) { // <--- Hardcoded stop at Row 33
    sheet.getRange("J"+r).setFormula('=IF(I'+r+'="","", I'+r+' - SUMIFS(Q$3:Q, P$3:P, B'+r+', K$3:K, TRUE))');
  }

  // Clear Active List & Matrix area without touching Archive (also reset text colors)
  var safeClearRow = archiveHeaderRow > -1 ? archiveHeaderRow - 1 : sheet.getMaxRows();
  sheet.getRange(3, 11, Math.max(1, safeClearRow - 2), 8).clearContent().removeCheckboxes().setFontColor(null);
  sheet.getRange(1, 19, sheet.getMaxRows(), sheet.getMaxColumns() - 18).clearContent().setBackground(null).setBorder(false, false, false, false, false, false).setFontColor(null);
  
  sheet.setColumnWidth(11, 40);  // K: Checkbox
  sheet.setColumnWidth(12, 150); // L: Customer
  sheet.setColumnWidth(13, 120); // M: Phone
  sheet.setColumnWidth(14, 120); // N: Discord
  sheet.hideColumns(15);         // O: Discord ID (Hidden)
  sheet.setColumnWidth(16, 350); // P: Product
  sheet.setColumnWidth(17, 50);  // Q: Qty
  sheet.setColumnWidth(18, 75);  // R: Queue #
  sheet.setColumnWidth(19, 25);  // S: Divider

  // --- BUILD ACTIVE LIST (With Red Text Highlights) ---
  var listOutput = [];
  var listColors = []; // Parallel array for text colors
  
  sortedCustomers.forEach(cust => {
    var details = customerDetails[cust];
    for (var prod in orderData[cust]) {
      var orderInfo = orderData[cust][prod];
      var isChecked = preservedChecks[cust + "|" + prod] || false;
      
      listOutput.push([isChecked, cust, details.phone, details.discord, details.id, prod, orderInfo.qty, "#" + orderInfo.queuePos]); 
      var qtyColor = orderInfo.hitLimit ? "#ff0000" : null;
      listColors.push([null, null, null, null, null, null, qtyColor, null]); 
    }
  });
  
  var listHeaderRange = sheet.getRange(2, 11, 1, 8);
  listHeaderRange.setValues([["Alloc.", "Customer", "Phone", "Discord", "ID", "Product", "Qty", "Queue #"]])
        .setFontWeight("bold").setBackground("#202124").setFontColor("#ffffff").setHorizontalAlignment("center");
        
  if (listOutput.length > 0) {
    var listDataRange = sheet.getRange(3, 11, listOutput.length, 8);
    listDataRange.setValues(listOutput).setFontColors(listColors).setVerticalAlignment("top");
    sheet.getRange(3, 11, listOutput.length, 1).insertCheckboxes(); 
    sheet.getRange(3, 16, listOutput.length, 1).setWrap(true); 
    sheet.getRange(3, 17, listOutput.length, 2).setHorizontalAlignment("center");
  }

  // --- BUILD MATRIX (With Red Text Highlights) ---
  sheet.getRange(2, 19, sheet.getMaxRows(), 1).setBackground("#f3f3f3"); // Divider in S
  
  var matrixHeaderRange = sheet.getRange(2, 20, 1, sortedCustomers.length);
  matrixHeaderRange.setValues([sortedCustomers]).setFontWeight("bold").setBackground("#202124").setFontColor("#ffffff").setHorizontalAlignment("center");

  var matrixMatrix = [];
  var matrixColors = []; // Parallel array for matrix colors

  validProducts.forEach(prodName => {
    var rowValues = [];
    var rowColors = [];
    sortedCustomers.forEach(custName => {
      var orderInfo = orderData[custName][prodName.toString().trim()];
      rowValues.push(orderInfo ? orderInfo.qty : ""); 
      rowColors.push((orderInfo && orderInfo.hitLimit) ? "#ff0000" : null); 
    });
    matrixMatrix.push(rowValues);
    matrixColors.push(rowColors);
  });

  sheet.getRange(3, 20, matrixMatrix.length, sortedCustomers.length)
       .setValues(matrixMatrix)
       .setFontColors(matrixColors) 
       .setHorizontalAlignment("center");
       
  sheet.autoResizeColumns(20, sortedCustomers.length);

  // This formula dynamically adjusts its range based on where "ARCHIVED PREORDERS" is found
var stopRow = sheet.getRange("B:B").createTextFinder("ARCHIVED PREORDERS").findNext().getRow() - 1;
var lastColLetter = sheet.getRange(1, 19 + sortedCustomers.length).getA1Notation().split('1')[0];

sheet.getRange("G3").setFormula('=ARRAYFORMULA(IF(B3:B' + stopRow + '="", "", BYROW(T3:' + lastColLetter + stopRow + ', lambda(row, SUM(row)))))');

  SpreadsheetApp.getUi().alert("Sync Complete!\nFormulas successfully bounded and users over allocation are highlighted in Red.");
}