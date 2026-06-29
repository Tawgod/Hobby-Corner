// ==========================================
// 3. POST ITEMS TO DISCORD (WITH ROLE PINGS & RELEASE DATES)
// ==========================================
function postTCGsToDiscord() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet(); // <--- Grabs the tab you are currently looking at!
  var configSheet = ss.getSheetByName("Config");
  var ui = SpreadsheetApp.getUi();
  var sheetName = sheet.getName();

  // Safety Check: Prevent posting your backend tabs to Discord
  var skipNames = ["Config", "Products", "Summary", "Customer", "_HiddenDB"];
  if (skipNames.indexOf(sheetName) !== -1) {
    ui.alert("Action Denied", "You cannot post system tabs to Discord. Please navigate to a specific preorder tab.", ui.ButtonSet.OK);
    return;
  }

  var botToken = configSheet.getRange("B1").getDisplayValue().replace(/\s/g, '');
  var proxyUrl = configSheet.getRange("B2").getDisplayValue().trim();
  if (proxyUrl.endsWith("/")) proxyUrl = proxyUrl.slice(0, -1);

  // FIXED: Changed prodSheet to sheet
  var tcgType = sheet.getRange("B1").getValue().toString().toLowerCase();
  var dueDate = sheet.getRange("E1").getDisplayValue();

  // Auto-route Channel & Role based on TCG Dropdown
  var channelIdStr = "";
  var roleIdStr = "";
  
  if (tcgType.includes("pokemon")) {
    channelIdStr = configSheet.getRange("B6").getDisplayValue();
    roleIdStr = configSheet.getRange("B9").getDisplayValue(); // Pokemon Role Row
  } else if (tcgType.includes("mtg") || tcgType.includes("magic")) {
    channelIdStr = configSheet.getRange("B7").getDisplayValue();
    roleIdStr = configSheet.getRange("B10").getDisplayValue(); // MTG Role Row
  } else {
    channelIdStr = configSheet.getRange("B8").getDisplayValue();
    roleIdStr = configSheet.getRange("B11").getDisplayValue(); // Other Role Row
  }

  // Parse Channel ID
  var channelMatch = channelIdStr.match(/\d+/g);
  var channelId = channelMatch ? channelMatch[channelMatch.length - 1] : channelIdStr.trim();

  if (!botToken || !proxyUrl || !channelId) {
    ui.alert("Missing Config info: Bot Token, Proxy URL, or Channel ID.");
    return;
  }

  // Parse Role ID and format for Discord Ping (<@&ROLE_ID>)
  var pingText = "";
  if (roleIdStr && roleIdStr.trim() !== "") {
    var roleMatch = roleIdStr.match(/\d+/g); // Extracts just the numbers safely
    if (roleMatch) {
      pingText = "<@&" + roleMatch[roleMatch.length - 1] + ">\n";
    }
  }

  // FIXED: Changed prodSheet to sheet
  // Build the Intro Message with the Ping at the top
  var introMessage = pingText + "🚨 **New " + sheet.getRange("B1").getValue() + " Preorders!**\n" +
                     "⏰ *Orders due by " + dueDate + "*\n" +
                     "📦 **React to an item to order, react with different emojis to order more than one.**";

  // Post Intro Message
  UrlFetchApp.fetch(proxyUrl + "/api/v10/channels/" + channelId + "/messages", {
    "method": "post", "contentType": "application/json",
    "headers": { "Authorization": "Bot " + botToken },
    "payload": JSON.stringify({ "content": introMessage }),
    "muteHttpExceptions": true
  });
  Utilities.sleep(2000);

  // Post Individual Embeds
  // FIXED: Changed prodSheet to sheet
  var lastRow = sheet.getLastRow();
  
  if (lastRow < 3) {
    ui.alert("No products found to post on this sheet.");
    return;
  }
  
  var data = sheet.getRange(3, 1, lastRow - 2, 6).getValues(); // Grabs Columns A through F

  for (var i = 0; i < data.length; i++) {
    var sku = data[i][0];
    var desc = data[i][1];
    var msrp = data[i][2];
    var limit = data[i][3];
    var relDate = data[i][4]; // Grab Release Date from Column E

    if (!desc || desc === "") continue;
    var displayPrice = typeof msrp === 'number' ? "$" + msrp.toFixed(2) : msrp;
    
    // Format Date if Google Sheets interprets it as a raw Date object
    if (relDate instanceof Date) {
      relDate = Utilities.formatDate(relDate, ss.getSpreadsheetTimeZone(), "MM/dd/yyyy");
    }
    
    // Build the custom description body
    var customDesc = "SKU: " + sku;
    if (limit) customDesc += "\nLimit: " + limit;
    if (relDate && relDate.toString().trim() !== "") customDesc += "\nRelease Date: " + relDate;

    var payload = {
      "embeds": [{
        "title": desc + "  —  " + displayPrice,
        "description": customDesc,
        "color": 3447003 
      }]
    };

    UrlFetchApp.fetch(proxyUrl + "/api/v10/channels/" + channelId + "/messages", {
      "method": "post", "contentType": "application/json",
      "headers": { "Authorization": "Bot " + botToken },
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    });
    Utilities.sleep(1500); // Prevent Rate Limits
  }
  
  ui.alert("Success", "Successfully posted to Discord Channel with Release Dates!", ui.ButtonSet.OK);
}