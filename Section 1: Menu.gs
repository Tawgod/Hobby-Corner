// ==========================================
// 1. MENU CREATION
// ==========================================
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('GW Preorders')
      .addItem('1. Scrape & Format Weekly Form', 'scrapeAndFormatWeeklyForm')
      .addSeparator()
      .addItem('2. Post Individual Items to Discord', 'postIndividualItemsToDiscord')
      .addSeparator()
      .addItem('3. Pull Orders from Discord', 'pullDiscordOrders')
      .addSeparator()
      .addItem('4. Auto-Submit Orders to GW', 'submitOrdersToGW')  // <--- ADD THIS LINE
      .addSeparator()
      .addSubMenu(ui.createMenu('Audits & Checks')
          .addItem('Check Weekly Sheet for Missing Notes', 'highlightIncompletePreorders')
          .addItem('Check Customer Tab for Missing Info', 'auditCustomerDatabase'))
      .addToUi();
}