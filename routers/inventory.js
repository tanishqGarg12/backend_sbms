const express = require('express');
const {
    createInventory,
    updateInventory,
    deleteInventory,
    getAllInventory,
    getInventoryById,
    restockInventory,
    getLowStockItems,
    search,
    getCategoryWisePurchasedValue,
    getCategoryWiseStock,
    getNewItemsLastTwoDays,
    getMonthlyPurchasePrice,
    getAllInventoryc
} = require('../controllers/Inventory');

const router = express.Router();

// Create new inventory item
router.post('/createinventory', createInventory);

// Update inventory item by ID
router.put('/inventory/:id', updateInventory);

// Delete inventory item by ID
router.delete('/inventory/:id', deleteInventory);

// Get all inventory items
router.get('/getallinventory', getAllInventory);
router.get('/getallinventoryc', getAllInventoryc);
router.get('/gettotal', getCategoryWiseStock);
router.get('/getmonthwise', getMonthlyPurchasePrice);
router.get('/getnewitems', getNewItemsLastTwoDays);
router.get('/getpurchasedprice',getCategoryWisePurchasedValue);

router.get('/getlowinventory', getLowStockItems);

// Get inventory item by ID
router.get('/getinventory/:id', getInventoryById);

router.get('/search',search)
// Restock inventory item by ID
router.patch('/restockinventory/:id/restock', restockInventory);

module.exports = router;
