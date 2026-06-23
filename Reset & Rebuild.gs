// ==========================================
// 5. RESET AND REBUILD PRODUCTS TAB
// ==========================================
function resetProductsTab() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  
  // Safety check to prevent accidental deletion
  var response = ui.alert(
    '⚠️ Reset Products Tab', 
    'Are you sure you want to completely clear the Products tab?\n\nAll current product entries will be permanently deleted, and the layout will be rebuilt from scratch.', 
    ui.ButtonSet.YES_NO
  );
  
  // If the user clicks anything other than YES, cancel the script
  if (response !== ui.Button.YES) {
    return; 
  }

  var sheet = ss.getSheetByName("Products");
  
  // If the sheet got deleted somehow, recreate it
  if (!sheet) {
    sheet = ss.insertSheet("Products");
  } else {
    // Completely wipe the existing sheet
    sheet.clear();
  }

  // Rebuild Row 1
  sheet.getRange("A1").setValue("TCG:").setFontWeight("bold");
  sheet.getRange("D1").setValue("Order Due By:").setFontWeight("bold");
  sheet.getRange("F1").setValue("Set Name:").setFontWeight("bold");
  
  // Rebuild Row 2 (Headers)
  var headers = [["SKU", "Item Description", "MSRP", "Order Limit", "Release Date", "UPC"]];
  sheet.getRange("A2:F2").setValues(headers).setFontWeight("bold").setBackground("#202124").setFontColor("#ffffff");
  
  // Freeze the top two rows
  sheet.setFrozenRows(2);
  
  // Adjust column widths for better readability
  sheet.setColumnWidth(1, 100); // SKU
  sheet.setColumnWidth(2, 350); // Item Description (Wide)
  sheet.setColumnWidth(3, 100); // MSRP
  sheet.setColumnWidth(4, 100); // Order Limit
  sheet.setColumnWidth(5, 120); // Release Date
  sheet.setColumnWidth(6, 120); // UPC
  
  // Attempt to re-apply the Data Validation Dropdown to B1 from the Config tab
  try {
    var configSheet = ss.getSheetByName("Config");
    if (configSheet) {
      var dropdownValues = configSheet.getRange("B5").getValue().toString().split(",");
      if (dropdownValues.length > 0 && dropdownValues[0] !== "") {
        // Clean up any spaces around the comma-separated list
        for (var i = 0; i < dropdownValues.length; i++) {
          dropdownValues[i] = dropdownValues[i].trim();
        }
        var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues, true).build();
        sheet.getRange("B1").setDataValidation(rule);
      }
    }
  } catch(e) {
    // If validation fails to build, just skip it rather than breaking the script
  }

  ui.alert("✅ Success!\n\nThe Products tab has been cleared and rebuilt.");
}