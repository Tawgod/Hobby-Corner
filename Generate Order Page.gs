// ==========================================
// 2. GENERATE ORDER PAGE
// ==========================================
function generateOrderPage() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var prodSheet = ss.getSheetByName("Products");
  
  if (!prodSheet) {
    SpreadsheetApp.getUi().alert("Could not find the 'Products' tab.");
    return;
  }

  var tcgType = prodSheet.getRange("B1").getValue();
  var dueDate = prodSheet.getRange("E1").getDisplayValue();
  var setName = prodSheet.getRange("G1").getValue().toString().trim();
  var lastRow = prodSheet.getLastRow();
  
  if (lastRow < 3) {
    SpreadsheetApp.getUi().alert("No products found in the Products tab starting on Row 3.");
    return;
  }

  if (setName === "") {
    SpreadsheetApp.getUi().alert("Please enter a Set Name in cell G1 to use as the new tab's name.");
    return;
  }

  // Create or reset the new Order Page using the name in G1
  var newSheetName = setName;
  var sheet = ss.getSheetByName(newSheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(newSheetName);
  } else {
    sheet.clear();
  }

  // Setup Top Headers
  sheet.getRange("A1").setValue("TCG:").setFontWeight("bold");
  sheet.getRange("B1").setValue(tcgType).setFontWeight("bold");
  sheet.getRange("D1").setValue("Order Due By:").setFontWeight("bold");
  sheet.getRange("E1").setValue(dueDate).setFontWeight("bold");
  sheet.getRange("F1").setValue("Set Name:").setFontWeight("bold");
  sheet.getRange("G1").setValue(setName).setFontWeight("bold");

  // Setup Column Headers
  var headers = [["SKU", "Item Description", "MSRP", "Order Limit", "Release Date", "UPC", "Total Order", "Discord Notes"]];
  sheet.getRange("A2:H2").setValues(headers).setFontWeight("bold").setBackground("#202124").setFontColor("#ffffff");
  sheet.setFrozenRows(2);

  // Read Product Data (A3:F)
  var productData = prodSheet.getRange(3, 1, lastRow - 2, 6).getValues();
  var outputData = [];

  for (var i = 0; i < productData.length; i++) {
    var sku = productData[i][0];
    var desc = productData[i][1];
    var msrp = productData[i][2];
    var limit = productData[i][3];
    var relDate = productData[i][4];
    var upc = productData[i][5];
    
    if (desc) outputData.push([sku, desc, msrp, limit, relDate, upc, "", ""]);
  }

  if (outputData.length > 0) {
    sheet.getRange(3, 1, outputData.length, 8).setValues(outputData);
    
    // Apply ARRAYFORMULA to track "Total Order" from any user columns added past Column I
    var currentRow = 3;
    sheet.getRange("G" + currentRow).setFormula('=ARRAYFORMULA(IF(B' + currentRow + ':B="", "", BYROW(I' + currentRow + ':' + sheet.getMaxColumns() + ', lambda(row, SUM(row)))))');
    
    var dataRange = sheet.getRange("A" + currentRow + ":H" + (currentRow + outputData.length - 1));
    dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  }

  sheet.autoResizeColumns(1, 8);
  sheet.setColumnWidth(2, 300); // Make Item Description wide
  
  SpreadsheetApp.getUi().alert("Success! Order Matrix built on tab: " + setName);
}