// ==========================================
// 1. MENU CREATION
// ==========================================
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('TCG Preorders')
      .addItem('1. Generate Order Page from Products', 'generateOrderPage')
      .addItem('2. Post Items to Discord', 'postTCGsToDiscord')
      .addItem('3. Pull Orders from Discord', 'pullDiscordOrders')
      .addSeparator()
      .addItem('🔔 Notify Customers of Pickup', 'notifyPickup')
      .addSeparator()
      .addItem('⚠️ Reset Products Tab', 'resetProductsTab')
      .addToUi();
}
