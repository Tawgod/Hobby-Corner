// ==========================================
// 3. POST ITEMS TO DISCORD (WITH ROLE PINGS & RELEASE DATES)
// ==========================================
function postTCGsToDiscord() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName("Config");
  var prodSheet = ss.getSheetByName("Products");

  var botToken = configSheet.getRange("B1").getDisplayValue().replace(/\s/g, '');
  var proxyUrl = configSheet.getRange("B2").getDisplayValue().trim();
  if (proxyUrl.endsWith("/")) proxyUrl = proxyUrl.slice(0, -1);

  var tcgType = prodSheet.getRange("B1").getValue().toString().toLowerCase();
  var dueDate = prodSheet.getRange("E1").getDisplayValue();

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
    SpreadsheetApp.getUi().alert("Missing Config info: Bot Token, Proxy URL, or Channel ID.");
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

  // Build the Intro Message with the Ping at the top
  var introMessage = pingText + "🚨 **New " + prodSheet.getRange("B1").getValue() + " Preorders!**\n" +
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
  var lastRow = prodSheet.getLastRow();
  var data = prodSheet.getRange(3, 1, lastRow - 2, 6).getValues(); // Grabs Columns A through F

  for (var i = 0; i < data.length; i++) {
    var sku = data[i][0];
    var desc = data[i][1];
    var msrp = data[i][2];
    var limit = data[i][3];
    var relDate = data[i][4]; // <--- Grab Release Date from Column E

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
  
  SpreadsheetApp.getUi().alert("Successfully posted to Discord Channel with Release Dates!");
}