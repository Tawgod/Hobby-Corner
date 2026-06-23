// ==========================================
// 2. SCRAPE & FORMAT SCRIPT (THE "VACUUM" FIX)
// ==========================================
function scrapeAndFormatWeeklyForm() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName("Config");
  
  var formUrl = configSheet.getRange("B1").getValue();
  if (!formUrl || formUrl === "") {
    SpreadsheetApp.getUi().alert("Please paste the Google Form URL into cell B1 of the Config tab.");
    return;
  }

  var configData = configSheet.getRange("A3:B7").getValues();
  var staticDict = {};
  configData.forEach(function(row) {
    if (row[0] && row[1]) {
      staticDict[row[0].toString().toLowerCase().trim()] = row[1];
    }
  });

  var response = UrlFetchApp.fetch(formUrl);
  var html = response.getContentText();
  var match = html.match(/var FB_PUBLIC_LOAD_DATA_ = (\[.*\]);/);
  
  if (!match) {
    SpreadsheetApp.getUi().alert("Could not find the form data. Ensure the link is correct and the form is public.");
    return;
  }

  var formItems = JSON.parse(match[1])[1][1]; 
  var productData = [];
  var releaseDate = "";
  
  // --- NEW: MEMORY TRACKER FOR TEXT BLOCKS ---
  var lastHeaderTitle = "";

  for (var i = 0; i < formItems.length; i++) {
    var item = formItems[i];
    
    // If this item has NO input field (it's a header, description, or text block)
    if (!item[4] || !item[4][0]) {
      if (item[1]) lastHeaderTitle = item[1].trim(); // Memorize it!
      continue; // Skip to the next item
    }
    
    // IT IS AN INPUT FIELD
    var rawTitle = item[1] || ""; 
    var helpText = item[2] || ""; // Grab the subtitle/help text too
    var lowerTitle = rawTitle.toLowerCase();
    var entryId = "entry." + item[4][0][0]; 
    
    if (lowerTitle.includes("quebec only")) continue;
    
    var isStatic = false;
    for (var key in staticDict) {
      if (lowerTitle.includes(key)) {
        isStatic = true;
        break;
      }
    }
    if (isStatic) continue;
    
    if (lowerTitle.includes("acknowledge") || lowerTitle.includes("official release date")) {
      var dateMatch = rawTitle.match(/(?:is|on)\s+([^.]*)/i);
      if (dateMatch && dateMatch[1]) releaseDate = dateMatch[1].trim(); 
    } 
    else {
      var rawName = "";
      var priceVal = "";
      
      // Combine Title and Help Text so we don't miss anything
      var fullText = rawTitle + "\n" + helpText;
      
      // 1. Extract Price from the combined text
      var priceMatch = fullText.match(/US:\s*\$([0-9,.]+)\s*MSRP/i) || fullText.match(/\$([0-9,.]+)/);
      if (priceMatch) priceVal = parseFloat(priceMatch[1].replace(/,/g, ''));

      // 2. Extract Name (Ignore lines that are just prices)
      var lines = fullText.split('\n');
      for (var l = 0; l < lines.length; l++) {
        var line = lines[l].trim();
        // If the line has text, and is NOT the price...
        if (line && !line.toLowerCase().includes("msrp") && !line.match(/^(US:\s*)?\$[0-9,.]+/i)) {
          rawName = line;
          break; 
        }
      }
      
      // 3. Fallback: Steal from the last Text Block if we STILL don't have a name
      if (!rawName) {
        rawName = lastHeaderTitle.split('\n')[0].trim();
        if (!rawName) rawName = "Unknown Item " + entryId;
      }
      
      // Clean Capitalization
      var cleanTitle = rawName.toLowerCase().replace(/\b\w/g, function(char) { return char.toUpperCase(); });

      productData.push([cleanTitle, priceVal, "", "", "", "", "", "", entryId, ""]); 
    }
  }

  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM-dd");
  var newSheetName = "Preorders " + today;
  var sheet = ss.getSheetByName(newSheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(newSheetName);
  } else {
    sheet.clear(); 
  }

  sheet.getRange("A1").setValue("Release Date:").setFontWeight("bold");
  sheet.getRange("B1").setValue(releaseDate).setFontWeight("bold").setHorizontalAlignment("left"); 
  var statusCell = sheet.getRange("D1");
  statusCell.setValue("Not Submitted").setFontWeight("bold").setHorizontalAlignment("center");
  var dropdownRule = SpreadsheetApp.newDataValidation().requireValueInList(["Not Submitted", "Submitted"], true).build();
  statusCell.setDataValidation(dropdownRule);

  var headers = [["Product Name", "MSRP", "Special Orders", "Store Order", "Total Order", "Submitted Order", "SO Value", "Ordered Value", "Entry ID", "Discord Notes"]];
  sheet.getRange("A2:J2").setValues(headers).setFontWeight("bold").setBackground("#202124").setFontColor("#ffffff");
  sheet.setFrozenRows(2);

  var currentRow = 3;

  if (productData.length > 0) {
    sheet.getRange(currentRow, 1, productData.length, 10).setValues(productData);
    
    // FORMULAS
    sheet.getRange("C" + currentRow).setFormula('=ARRAYFORMULA(IF(A' + currentRow + ':A="", "", BYROW(O' + currentRow + ':' + sheet.getMaxColumns() + ', lambda(row, SUM(row)))))');
    sheet.getRange("E" + currentRow).setFormula('=ARRAYFORMULA(IF(A' + currentRow + ':A="", "", VALUE(0&C' + currentRow + ':C) + VALUE(0&D' + currentRow + ':D)))');
    sheet.getRange("G" + currentRow).setFormula('=ARRAYFORMULA(IF(A' + currentRow + ':A="", "", VALUE(0&C' + currentRow + ':C) * B' + currentRow + ':B))');
    sheet.getRange("H" + currentRow).setFormula('=ARRAYFORMULA(IF(A' + currentRow + ':A="", "", VALUE(0&E' + currentRow + ':E) * B' + currentRow + ':B))');

    var dataRange = sheet.getRange("A" + currentRow + ":J" + (currentRow + productData.length - 1));
    dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  }

  var rules = sheet.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Not Submitted").setBackground("#fce8e6").setFontColor("#c5221f").setRanges([statusCell]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Submitted").setBackground("#e6f4ea").setFontColor("#137333").setRanges([statusCell]).build());
  sheet.setConditionalFormatRules(rules);

  sheet.hideColumns(9); 
  sheet.autoResizeColumns(1, 8);
  sheet.setColumnWidth(1, 300); 
  sheet.setColumnWidth(10, 350); 
  
  SpreadsheetApp.getUi().alert("Success! Form scraped, layout built, and Discord Notes column added to J.");
}