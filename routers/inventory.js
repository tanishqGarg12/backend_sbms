const express = require('express');
const {
    createInventory,
    updateInventory,
    deleteInventory,
    getAllInventory,
    getInventoryById,
    restockInventory,
    getLowStockItems
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

router.get('/getlowinventory', getLowStockItems);

// Get inventory item by ID
router.get('/getinventory/:id', getInventoryById);

// Restock inventory item by ID
router.patch('/restockinventory/:id/restock', restockInventory);

module.exports = router;
