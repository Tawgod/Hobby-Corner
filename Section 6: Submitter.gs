// ==========================================
// 6. AUTO FORM SUBMISSION TO GW (MASTER ZERO-FILL FIX)
// ==========================================
function submitOrdersToGW() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var configSheet = ss.getSheetByName("Config");

  var formUrl = configSheet.getRange("B1").getValue();
  if (!formUrl || !formUrl.includes("docs.google.com/forms")) {
    SpreadsheetApp.getUi().alert("Invalid Form URL in Config B1.");
    return;
  }
  var postUrl = formUrl.replace(/\/viewform.*/, "/formResponse");

  var ui = SpreadsheetApp.getUi();
  var confirm = ui.alert(
    "Confirm Final Submission", 
    "Are you sure you want to submit these orders to GW?\n\nThis will send your Total Orders and automatically zero-fill the French/Quebec items.", 
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  ss.toast("Analyzing form structure & zero-filling hidden items...", "Auto Submit", 8);
  var payload = {};

  // 1. Setup Static Info & Native Email Capture
  var configData = configSheet.getRange("A3:B7").getValues();
  var staticDict = {};
  var userEmail = "";
  
  configData.forEach(function(row) {
    if (row[0] && row[1]) {
      var key = row[0].toString().toLowerCase().trim();
      staticDict[key] = row[1];
      if (key.includes("email")) userEmail = row[1].toString().trim();
    }
  });

  if (userEmail) payload["emailAddress"] = userEmail;

  // 2. Read what is CURRENTLY on your Spreadsheet
  var sheetDataMap = {};
  var lastRow = sheet.getLastRow();
  if (lastRow >= 3) {
    var data = sheet.getRange(3, 1, lastRow - 2, 9).getValues(); 
    for (var i = 0; i < data.length; i++) {
      var totalOrder = data[i][4]; // Column E
      var entryId = data[i][8];    // Column I
      if (entryId && entryId.toString().startsWith("entry.")) {
        sheetDataMap[entryId] = (totalOrder && !isNaN(totalOrder) && totalOrder > 0) ? Math.floor(totalOrder).toString() : "0";
      }
    }
  }

  // 3. Map the LIVE Form IDs & Fill EVERYTHING
  var response = UrlFetchApp.fetch(formUrl);
  var html = response.getContentText();
  var match = html.match(/var FB_PUBLIC_LOAD_DATA_ = (\[.*\]);/);
  var orderCount = 0;
  
  if (match) {
    var formItems = JSON.parse(match[1])[1][1];
    var pageCount = 0;
    
    for (var i = 0; i < formItems.length; i++) {
      var item = formItems[i];
      if (item[3] === 8) pageCount++; // Count page breaks
      
      if (item[4] && item[4][0]) {
        var rawTitle = item[1] || "";
        var lowerTitle = rawTitle.toLowerCase();
        var entryId = "entry." + item[4][0][0];

        var matchedStatic = false;
        for (var key in staticDict) {
          if (lowerTitle.includes(key)) {
            payload[entryId] = staticDict[key]; 
            matchedStatic = true;
            break;
          }
        }

        if (!matchedStatic) {
          // Checkboxes
          if (lowerTitle.includes("acknowledge") || lowerTitle.includes("agree") || lowerTitle.includes("release date")) {
            try {
              payload[entryId] = item[4][0][1][0][0]; 
            } catch(e) {
              payload[entryId] = "Yes"; 
            }
          } else {
            // IT IS A PRODUCT FIELD
            // If it is on our sheet, use the sheet's value. 
            // If it is NOT on our sheet (e.g. Quebec items), FORCE a "0".
            if (sheetDataMap[entryId]) {
              payload[entryId] = sheetDataMap[entryId];
              if (sheetDataMap[entryId] !== "0") orderCount++;
            } else {
              payload[entryId] = "0"; // The magic fix for missing/filtered fields
            }
          }
        }
      }
    }
    
    var pageHistoryArr = [];
    for (var p = 0; p <= pageCount; p++) {
      pageHistoryArr.push(p);
    }
    payload["pageHistory"] = pageHistoryArr.join(",");
  }

  if (orderCount === 0) {
    ui.alert("No items have a Total Order quantity > 0.\nSubmission cancelled.");
    return;
  }

  // 4. Send the Request
  var options = {
    "method": "post",
    "payload": payload,
    "muteHttpExceptions": true
  };

  try {
    var res = UrlFetchApp.fetch(postUrl, options);
    
    if (res.getResponseCode() === 200) {
      sheet.getRange("D1").setValue("Submitted");
      var eValues = sheet.getRange(3, 5, lastRow - 2, 1).getValues();
      sheet.getRange(3, 6, lastRow - 2, 1).setValues(eValues);

      ui.alert("✅ SUCCESS!\n\nSubmitted " + orderCount + " line items to GW.\nThe status is updated, and your final quantities have been recorded in Column F.");
    } else {
      var debugText = "";
      for (var k in payload) {
        debugText += k + " : " + payload[k] + "\n";
      }
      ui.alert("❌ Submission Failed. HTTP Error: " + res.getResponseCode() + "\n\n--- PAYLOAD SENT ---\n" + debugText.substring(0, 600) + "\n\nLook at the list above. Did a 'Required' field get missed?");
    }
  } catch (e) {
    ui.alert("❌ Error connecting to Form:\n" + e.message);
  }
}