// ==========================================
// 5. DATA AUDIT SCRIPTS
// ==========================================
function highlightIncompletePreorders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return;

  var range = sheet.getRange(3, 1, lastRow - 2, 10);
  var data = range.getValues();
  var backgrounds = [];
  var incompleteCount = 0;

  for (var i = 0; i < data.length; i++) {
    var specialOrderQty = data[i][2]; 
    var discordNotes = data[i][9];    
    
    if (specialOrderQty > 0 && (!discordNotes || discordNotes.toString().trim() === "")) {
      backgrounds.push(["#fce8e6", "#fce8e6", "#fce8e6", "#fce8e6", "#fce8e6", "#fce8e6", "#fce8e6", "#fce8e6", "#fce8e6", "#fce8e6"]);
      incompleteCount++;
    } else {
      var color = (i % 2 === 0) ? "#ffffff" : "#f3f3f3";
      backgrounds.push([color, color, color, color, color, color, color, color, color, color]);
    }
  }
  
  range.setBackgrounds(backgrounds);
  
  if (incompleteCount > 0) {
    SpreadsheetApp.getUi().alert("Found " + incompleteCount + " items with quantities but no customer notes.");
  } else {
    SpreadsheetApp.getActiveSpreadsheet().toast("All orders have customer notes!", "Check Complete");
  }
}

function auditCustomerDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName("Config");
  
  // --- LINK TO EXTERNAL MASTER SHEET ---
  var masterId = configSheet.getRange("B13").getDisplayValue().trim();
  var customerSheet;
  try {
    customerSheet = SpreadsheetApp.openById(masterId).getSheetByName("Customer");
  } catch(e) {
    SpreadsheetApp.getUi().alert("Could not connect to Master Customer List for audit. Please verify Config B13.");
    return;
  }
  
  var lastRow = customerSheet.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert("Master Customer sheet is empty.");
    return;
  }
  
  var range = customerSheet.getRange(2, 1, lastRow - 1, 4);
  var data = range.getValues();
  var backgrounds = [];
  var incompleteCount = 0;
  
  for (var i = 0; i < data.length; i++) {
    var name = data[i][0].toString().trim();
    var phone = data[i][1].toString().trim();
    var discord = data[i][2].toString().trim();
    var email = data[i][3].toString().trim();
    
    if (name === "" && phone === "" && discord === "" && email === "") {
      backgrounds.push(["#ffffff", "#ffffff", "#ffffff", "#ffffff"]);
      continue;
    }

    if (name === "" || phone === "" || discord === "" || email === "") {
      backgrounds.push(["#fff2cc", "#fff2cc", "#fff2cc", "#fff2cc"]); 
      incompleteCount++;
    } else {
      backgrounds.push(["#ffffff", "#ffffff", "#ffffff", "#ffffff"]); 
    }
  }
  
  range.setBackgrounds(backgrounds);
  
  if (incompleteCount > 0) {
    SpreadsheetApp.getUi().alert("Found " + incompleteCount + " customers with missing information (Highlighted Yellow) on the Master Sheet.");
  } else {
    SpreadsheetApp.getActiveSpreadsheet().toast("All customer records are complete!", "Audit Passed");
  }
}

