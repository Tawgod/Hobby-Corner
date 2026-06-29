// ==========================================
// 6. UPDATE SUMMARY, CUSTOMER TRACKER & ORGANIZE TABS
// ==========================================
function organizeAndSummarize() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var summarySheet = ss.getSheetByName("Summary");
  var customerSheet = ss.getSheetByName("Customer"); 
  var hiddenDbSheet = ss.getSheetByName("_HiddenDB");
  var ui = SpreadsheetApp.getUi();

  // 1. Setup Tabs
  if (!summarySheet) { summarySheet = ss.insertSheet("Summary", 2); }
  else if (summarySheet.getIndex() !== 3) { ss.setActiveSheet(summarySheet); ss.moveActiveSheet(3); }

  if (!customerSheet) { customerSheet = ss.insertSheet("Customer", 3); }
  else if (customerSheet.getIndex() !== 4) { ss.setActiveSheet(customerSheet); ss.moveActiveSheet(4); }

  if (!hiddenDbSheet) { hiddenDbSheet = ss.insertSheet("_HiddenDB"); hiddenDbSheet.hideSheet(); }

  // 2. Set Headers
  summarySheet.getRange("A1:E1").setValues([["Set Name", "Release Date", "Order Due By", "Total Unique Customers", "Not Picked Up"]])
    .setFontWeight("bold").setBackground("#202124").setFontColor("#ffffff").setHorizontalAlignment("center").setWrap(true);

  customerSheet.getRange("A1:D1").setValues([["Customer Name", "Total Items Not Picked Up", "Missed Preorders (Count)", "Specific Sets Missed (Links)"]])
    .setFontWeight("bold").setBackground("#202124").setFontColor("#ffffff").setHorizontalAlignment("center").setWrap(true);

  // 3. Process Data
  var allSheets = ss.getSheets();
  var summaryData = [];
  var delinquentCustomers = {}; 
  var dbData = []; 
  var skipNames = ["Config", "Products", "Summary", "Customer", "_HiddenDB"]; 

  allSheets.forEach(sheet => {
    var sheetName = sheet.getName();
    if (skipNames.includes(sheetName)) return;

    if (sheet.getIndex() > 5) { ss.setActiveSheet(sheet); ss.moveActiveSheet(5); }

    var setName = sheet.getRange("G1").getDisplayValue() || sheetName; 
    var sheetId = sheet.getSheetId();
    var hyperlinkedName = '=HYPERLINK("#gid=' + sheetId + '", "' + setName.replace(/"/g, '""') + '")';
    var dueDate = sheet.getRange("E1").getDisplayValue(); 
    var releaseDate = sheet.getRange("E3").getDisplayValue(); 

    // Unique Customer Count
    var lastRow = sheet.getLastRow();
    var uniqueCustomers = 0;
    if (lastRow >= 3) {
      var custData = sheet.getRange(3, 12, lastRow - 2, 1).getValues().flat(); 
      var uniqueSet = new Set();
      custData.forEach(n => { if (n.toString().trim() !== "") uniqueSet.add(n.toString().trim()); });
      uniqueCustomers = uniqueSet.size;
    }

    // Scan Archive
    var notPickedUpCount = 0;
    var archiveFinder = sheet.getRange("A:A").createTextFinder("ARCHIVED PREORDERS").findNext();
    if (archiveFinder) {
      var archiveRow = archiveFinder.getRow();
      var maxRows = sheet.getMaxRows();
      if (maxRows > archiveRow) {
        var archiveData = sheet.getRange(archiveRow, 1, maxRows - archiveRow + 1, 5).getValues();
        var currentCustomer = "";
        archiveData.forEach(row => {
          var colA = row[0].toString().trim();
          var itemName = row[1].toString().trim();
          var qty = parseInt(row[2]) || 0; 
          var isMissed = row[4] === true; 
          if (colA === "ARCHIVED PREORDERS" || colA === "Customer" || colA === "") return;
          if (colA !== "↳") { currentCustomer = colA; } 
          else if (colA === "↳" && isMissed) {
            notPickedUpCount++; 
            if (currentCustomer !== "") {
              if (!delinquentCustomers[currentCustomer]) delinquentCustomers[currentCustomer] = { items: 0, preorders: new Map() };
              delinquentCustomers[currentCustomer].items += Math.max(1, qty); 
              delinquentCustomers[currentCustomer].preorders.set(sheetName, { name: setName, id: sheetId });
              dbData.push([currentCustomer, hyperlinkedName, itemName, Math.max(1, qty)]);
            }
          }
        });
      }
    }
    summaryData.push([hyperlinkedName, releaseDate, dueDate, uniqueCustomers, notPickedUpCount]);
  });

  // 4. Clear and Write Data Safely
  summarySheet.getRange(2, 1, Math.max(1, summarySheet.getMaxRows() - 1), 5).clearContent();
  if (summaryData.length > 0) {
    summarySheet.getRange(2, 1, summaryData.length, 5).setValues(summaryData).setHorizontalAlignment("center");
  }

  // Set widths for Summary Tab
  summarySheet.setColumnWidth(1, 250); 
  summarySheet.setColumnWidth(2, 150); 
  summarySheet.setColumnWidth(3, 150); 
  summarySheet.setColumnWidth(4, 200); 
  summarySheet.setColumnWidth(5, 150); 

  customerSheet.getRange(2, 1, Math.max(1, customerSheet.getMaxRows() - 1), 4).clearContent();
  
  // Transform data for the Customer tracker
  var combinedCustomerData = [];
  for (var cust in delinquentCustomers) {
    var missedMap = delinquentCustomers[cust].preorders;
    var richTextBuilder = SpreadsheetApp.newRichTextValue();
    var fullText = "";
    var linkRanges = [];
    var idx = 0;
    missedMap.forEach((details, sName) => {
      var prefix = (idx > 0) ? "\n" : "";
      var startPos = fullText.length + prefix.length;
      fullText += prefix + details.name;
      linkRanges.push({ start: startPos, end: fullText.length, url: "#gid=" + details.id });
      idx++;
    });
    richTextBuilder.setText(fullText);
    linkRanges.forEach(lr => richTextBuilder.setLinkUrl(lr.start, lr.end, lr.url));
    combinedCustomerData.push({ name: cust, items: delinquentCustomers[cust].items, count: missedMap.size, richText: richTextBuilder.build() });
  }

  combinedCustomerData.sort((a, b) => b.count - a.count || b.items - a.items);

  // Write only if data exists to avoid range dimension errors
  if (combinedCustomerData.length > 0) {
    var vals = combinedCustomerData.map(r => [r.name, r.items, r.count]);
    var rich = combinedCustomerData.map(r => [r.richText]);
    
    // Explicit range sizing based on current data length
    customerSheet.getRange(2, 1, vals.length, 3).setValues(vals).setHorizontalAlignment("center");
    customerSheet.getRange(2, 1, vals.length, 1).setHorizontalAlignment("left");
    customerSheet.getRange(2, 4, rich.length, 1).setRichTextValues(rich).setHorizontalAlignment("left").setWrap(true);
  }

  // Update widths for Customer Tab
  customerSheet.setColumnWidth(1, 200); 
  customerSheet.setColumnWidth(2, 180); 
  customerSheet.setColumnWidth(3, 180); 
  customerSheet.setColumnWidth(4, 300); 

  // 5. Update Hidden DB
  hiddenDbSheet.clear();
  hiddenDbSheet.getRange("A1:D1").setValues([["Customer", "Sheet Link", "Item", "Qty"]]);
  if (dbData.length > 0) {
    hiddenDbSheet.getRange(2, 1, dbData.length, 4).setValues(dbData);
  }

  // 6. Reset/Rebuild Interactive Dashboard (Strictly Columns G through I)
  // Clean up any old dashboard elements 
  customerSheet.getRange("G:I").clearContent().clearDataValidations().setBackground(null).setBorder(false, false, false, false, false, false);
  
  // Dashboard Header (Merged G through I)
  customerSheet.getRange("G1:I1").merge().setValue("🔍 Customer Quick Search")
    .setFontWeight("bold").setBackground("#4285f4").setFontColor("#ffffff").setHorizontalAlignment("center");
  
  // Create Search Box (Merged H and I)
  customerSheet.getRange("G2").setValue("Type Customer Name:").setFontWeight("bold").setHorizontalAlignment("right");
  customerSheet.getRange("H2:I2").merge().setBackground("#f3f3f3").setBorder(true, true, true, true, null, null);

  // Table Headers (G through I)
  customerSheet.getRange("G4:I4").setValues([["Preorder Set (Link)", "Missed Product", "Qty"]])
    .setFontWeight("bold").setBackground("#5f6368").setFontColor("#ffffff").setHorizontalAlignment("center");
  
  // The magic formula: Searches the Hidden DB
  var searchFormula = '=IF(ISBLANK(H2), "Type a name in H2 to search...", ' +
                      'IFERROR(FILTER(\'_HiddenDB\'!B:D, REGEXMATCH(LOWER(\'_HiddenDB\'!A:A), LOWER(H2))), "No customer found matching that name."))';
  
  customerSheet.getRange("G5").setFormula(searchFormula);

  // Adjust column widths for the dashboard
  customerSheet.setColumnWidth(5, 50);  // E (Spacer column)
  customerSheet.setColumnWidth(6, 50);  // F (Spacer column)
  customerSheet.setColumnWidth(7, 220); // G (Set Link)
  customerSheet.setColumnWidth(8, 300); // H (Item Name)
  customerSheet.setColumnWidth(9, 75);  // I (Qty)

  ui.alert("Archive Synced", "All pages and dashboards updated successfully.", ui.ButtonSet.OK);
}