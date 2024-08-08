import { inventory } from "../models/inventory";

// Create new inventory item
export const createInventory = async (req, res) => {
    try {
        const { name, category, description, quantity, unit, price, supplierName, stockLocations } = req.body;

        if (!name || !category || !unit || !price) {
            return res.status(400).json({ message: 'Fill all required details.' });
        }
        if (quantity < 0 || price < 0) {
            return res.status(400).json({ message: 'Quantity and price must be non-negative.' });
        }

        const newInventoryItem = new inventory({
            name,
            category,
            description,
            quantity,
            unit,
            price,
            supplierName,
            stockLocations
        });

        const savedItem = await newInventoryItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update inventory item
export const updateInventory = async (req, res) => {
    const { name, category, description, quantity, unit, price, supplierName } = req.body;
    try {
        const inventoryItem = await inventory.findById(req.params.id);
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        const updatedItem = await inventory.findByIdAndUpdate(
            req.params.id,
            {
                name: name || inventoryItem.name,
                category: category || inventoryItem.category,
                description: description || inventoryItem.description,
                quantity: quantity !== undefined ? quantity : inventoryItem.quantity,
                unit: unit || inventoryItem.unit,
                price: price !== undefined ? price : inventoryItem.price,
                supplierName: supplierName || inventoryItem.supplierName,
            },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete inventory item
export const deleteInventory = async (req, res) => {
    try {
        const deletedItem = await inventory.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all inventory items
export const getAllInventory = async (req, res) => {
    try {
        const inventoryItems = await inventory.find();
        res.status(200).json(inventoryItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get inventory item by ID
export const getInventoryById = async (req, res) => {
    try {
        const inventoryItem = await inventory.findById(req.params.id);
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json(inventoryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const restockInventory = async (req, res) => {
    const { quantity } = req.body;
    try {
        const inventoryItem = await inventory.findById(req.params.id);
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        inventoryItem.quantity += quantity;
        const updatedItem = await inventoryItem.save();

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

