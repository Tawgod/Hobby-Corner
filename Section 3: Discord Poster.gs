// ==========================================
// 3. DISCORD BOT POSTER (THIN FORMAT)
// ==========================================
function postIndividualItemsToDiscord() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName("Config");
  
  var botToken = configSheet.getRange("B9").getDisplayValue().replace(/\s/g, '');
  var rawChannel = configSheet.getRange("B10").getDisplayValue();
  var channelMatch = rawChannel.match(/\d+/g);
  var channelId = channelMatch ? channelMatch[channelMatch.length - 1] : rawChannel.trim();
  var proxyUrl = configSheet.getRange("B11").getDisplayValue().trim();
  if (proxyUrl.endsWith("/")) proxyUrl = proxyUrl.slice(0, -1);

  if (!botToken || !channelId || !proxyUrl) {
    SpreadsheetApp.getUi().alert("Missing Bot Token, Channel ID, or Proxy URL in Config.");
    return;
  }
  
  var sheet = ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return;
  
  var releaseDate = sheet.getRange("B1").getValue();
  var headerTags = sheet.getRange("J1").getDisplayValue().trim();
  
  var introMessage = (headerTags !== "" ? headerTags + "\n" : "") +
                     "🚨 **Preorders for release on " + releaseDate + "**\n" +
                     "⏰ *Due by 4:00 PM Tuesday*\n" +
                     "📦 **React to an item to order, react with different emojis to order more than one.**\n" +
                     "💡 *Mobile Tip: Click to the left of the box to react easily!*";
  
  var baseOptions = {
    "method": "post",
    "contentType": "application/json",
    "headers": { "Authorization": "Bot " + botToken },
    "muteHttpExceptions": true 
  };

  UrlFetchApp.fetch(proxyUrl + "/api/v10/channels/" + channelId + "/messages", {
    "method": "post",
    "contentType": "application/json",
    "headers": { "Authorization": "Bot " + botToken },
    "payload": JSON.stringify({ "content": introMessage }),
    "muteHttpExceptions": true
  });
  Utilities.sleep(2000);

  var data = sheet.getRange(3, 1, lastRow - 2, 10).getValues();
  
  for (var i = 0; i < data.length; i++) {
    var productName = data[i][0];
    var msrp = data[i][1];
    var customDescription = data[i][9]; 
    
    if (!productName || productName === "") continue;
    
    var displayPrice = typeof msrp === 'number' ? "$" + msrp.toFixed(2) : msrp;
    
    var payload = {
      "embeds": [{
        "title": productName + "  —  " + displayPrice,
        "color": 2303786 
      }]
    };
    
    if (customDescription && customDescription.toString().trim() !== "") {
      payload.embeds[0].description = customDescription.toString().trim();
    }
    
    UrlFetchApp.fetch(proxyUrl + "/api/v10/channels/" + channelId + "/messages", {
      "method": "post",
      "contentType": "application/json",
      "headers": { "Authorization": "Bot " + botToken },
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    });
    Utilities.sleep(1500); 
  }
  
  SpreadsheetApp.getUi().alert("Posted via Bot in Thin Format!");
}

