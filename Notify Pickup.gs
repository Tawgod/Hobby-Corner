// ==========================================
// 5. NOTIFY CUSTOMERS OF PICKUP & ARCHIVE (COLUMN A-H LAYOUT)
// ==========================================
function notifyPickup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var configSheet = ss.getSheetByName("Config");

  var botToken = configSheet.getRange("B1").getDisplayValue().replace(/\s/g, '');
  var proxyUrl = configSheet.getRange("B2").getDisplayValue().trim();
  if (proxyUrl.endsWith("/")) proxyUrl = proxyUrl.slice(0, -1);

  if (!botToken || !proxyUrl) {
    SpreadsheetApp.getUi().alert("Missing Bot Token or Proxy URL in Config tab.");
    return;
  }

  var ui = SpreadsheetApp.getUi();
  var deadlineRes = ui.prompt("Pickup Notification", "Enter the pickup deadline (e.g. 'Friday at 7 PM' or 'within 7 days'):", ui.ButtonSet.OK_CANCEL);
  if (deadlineRes.getSelectedButton() !== ui.Button.OK) return;
  var deadline = deadlineRes.getResponseText();

  // 1. Get Product Release Dates & Find Archive Boundary
  var aValues = sheet.getRange("A:A").getValues();
  var bValues = sheet.getRange("B:B").getValues();
  var lastProdRow = 0;
  var archiveHeaderRow = -1;
  
  for (var i = 0; i < aValues.length; i++) {
    if (aValues[i][0] === "ARCHIVED PREORDERS") {
      archiveHeaderRow = i + 1; 
      break;
    }
    if (bValues[i][0] !== "") lastProdRow = i + 1;
  }

  var prodData = sheet.getRange(3, 2, Math.max(1, lastProdRow - 2), 4).getValues(); 
  var releaseDates = {};
  prodData.forEach(row => {
    if (row[0]) {
      var d = row[3];
      if (d instanceof Date) d = Utilities.formatDate(d, ss.getSpreadsheetTimeZone(), "MM/dd/yyyy");
      releaseDates[row[0].toString().trim()] = d || "TBD";
    }
  });

  // 2. Scan the Active List (K3:R)
  var listValues = sheet.getRange("K:R").getValues();
  var activeRows = [];
  var rowsToArchive = 0; 
  var groupedDMs = {};

  for (var i = 2; i < listValues.length; i++) {
    var row = listValues[i];
    var allocated = row[0]; // K
    var customer = row[1];  // L
    var phone = row[2];     // M
    var discord = row[3];   // N
    var discordId = row[4]; // O (Hidden ID)
    var product = row[5];   // P
    var qty = row[6];       // Q
    var queue = row[7];     // R

    if (!customer && !product) continue;

    if (allocated === true && discordId) {
      if (!groupedDMs[discordId]) {
        groupedDMs[discordId] = { 
          customer: customer, phone: phone, discord: discord, id: discordId, 
          itemsDM: [], itemsArchive: [] 
        };
      }
      var relDate = releaseDates[product.trim()] || "TBD";
      groupedDMs[discordId].itemsDM.push(`• ${qty}x ${product} (Release: ${relDate})`);
      groupedDMs[discordId].itemsArchive.push({ product: product, qty: qty, queue: queue });
      rowsToArchive++;
    } else if (customer) {
      activeRows.push(row);
    }
  }

  if (rowsToArchive === 0) return ui.alert("No new items are marked as 'Allocated' (Checkbox in Column K).");

  // 3. Send DMs Grouped by User
  var messagesSent = 0;
  for (var dId in groupedDMs) {
    var data = groupedDMs[dId];
    var message = `Hello ${data.customer}! Your preorder is allocated and ready for pickup! 🎉\n\n` +
                  `**Items Ready:**\n${data.itemsDM.join("\n")}\n\n` +
                  `**Pickup Deadline:** ${deadline}\n\n` +
                  `Please let us know if you have any questions or if you need more time to pickup your order!`;

    var openRes = UrlFetchApp.fetch(proxyUrl + "/api/v10/users/@me/channels", {
      "method": "post", "contentType": "application/json", "headers": { "Authorization": "Bot " + botToken },
      "payload": JSON.stringify({ "recipient_id": dId.toString().trim() }), "muteHttpExceptions": true
    });
      
    if (openRes.getResponseCode() === 200 || openRes.getResponseCode() === 201) {
      var chan = JSON.parse(openRes.getContentText());
      var msgRes = UrlFetchApp.fetch(proxyUrl + "/api/v10/channels/" + chan.id + "/messages", {
        "method": "post", "contentType": "application/json", "headers": { "Authorization": "Bot " + botToken },
        "payload": JSON.stringify({ "content": message }), "muteHttpExceptions": true
      });
      if (msgRes.getResponseCode() === 200) messagesSent++;
    }
    Utilities.sleep(1000); 
  }

  // 4. Update the Active Sheet (Shift non-allocated items up in K:R)
  sheet.getRange(3, 11, sheet.getMaxRows() - 2, 8).clearContent().removeCheckboxes();
  if (activeRows.length > 0) {
    sheet.getRange(3, 11, activeRows.length, 8).setValues(activeRows);
    sheet.getRange(3, 11, activeRows.length, 1).insertCheckboxes();
  }

  // 5. Build/Append to Archive Section (Now starting in Column A)
  if (archiveHeaderRow === -1) {
    archiveHeaderRow = Math.max(33, lastProdRow + 4); 
    
    sheet.getRange(archiveHeaderRow, 1).setValue("ARCHIVED PREORDERS").setFontWeight("bold").setFontSize(12);
    // Columns: A, B, C, D, E, F, G, H
    sheet.getRange(archiveHeaderRow + 1, 1, 1, 8).setValues([["Customer", "Product", "Qty", "Queue #", "Did Not Pick Up", "ID", "Phone", "Discord"]])
        .setFontWeight("bold").setBackground("#5f6368").setFontColor("#ffffff");
    archiveHeaderRow += 2; 
  } else {
    var bottom = archiveHeaderRow + 1;
    var searchData = sheet.getRange(bottom, 1, sheet.getMaxRows() - bottom + 1, 8).getValues();
    for (var r = 0; r < searchData.length; r++) {
      if (searchData[r].join("").trim() === "") {
        archiveHeaderRow = bottom + r;
        break;
      }
    }
  }

  // 6. Build and Format the Grouped Archive Output
  var archiveOutput = [];
  var backgrounds = [];
  var fontWeights = [];
  var checkboxCellList = [];
  var currentRelativeRow = 0;

  for (var dId in groupedDMs) {
    var grp = groupedDMs[dId];

    // Build the Customer Row (Blue Background, Bold)
    // A: Customer | B-E: Blank | F: ID | G: Phone | H: Discord
    archiveOutput.push([grp.customer, "", "", "", "", grp.id, grp.phone, grp.discord]);
    backgrounds.push(["#cfe2f3", "#cfe2f3", "#cfe2f3", "#cfe2f3", "#cfe2f3", "#cfe2f3", "#cfe2f3", "#cfe2f3"]);
    fontWeights.push(["bold", "bold", "bold", "bold", "bold", "bold", "bold", "bold"]);
    currentRelativeRow++;

    // Build the Product Rows directly underneath
    // A: Arrow | B: Product | C: Qty | D: Queue | E: Checkbox | F-H: Blank
    grp.itemsArchive.forEach(item => {
      archiveOutput.push(["↳", item.product, item.qty, item.queue, false, "", "", ""]);
      backgrounds.push(["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]);
      fontWeights.push(["normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal"]);
      
      // Save the cell reference (Column E) to insert a checkbox later
      checkboxCellList.push("E" + (archiveHeaderRow + currentRelativeRow));
      currentRelativeRow++;
    });
  }

  // Write Data & Apply Formatting (Starting at Column A / Index 1)
  var targetRange = sheet.getRange(archiveHeaderRow, 1, archiveOutput.length, 8);
  targetRange.setValues(archiveOutput);
  targetRange.setBackgrounds(backgrounds);
  targetRange.setFontWeights(fontWeights);

  // Insert checkboxes ONLY on the product rows in Column E
  if (checkboxCellList.length > 0) {
    sheet.getRangeList(checkboxCellList).insertCheckboxes();
  }

  ui.alert(`Sweep complete!\nSent ${messagesSent} notifications and organized the allocated items in Columns A-H.`);
}