const express = require("express");
const router = express.Router();
const Inventory = require("../Schema/Inventory/inventory"); // Make sure the import path is correct
const Product = require("../Schema/CattleFeed/Product");

// Route to get all inventory items
router.get("/get-inventory", async (req, res) => {
    try {
        const inventoryItems = await Inventory.find().populate('product');;
        res.status(200).json({ success: true, inventoryItems });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

// Route to update an inventory item
router.put("/inventory-update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedInventoryItem = await Inventory.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedInventoryItem) {
            return res.status(404).json({ success: false, error: "Inventory item not found" });
        }

        res.status(200).json({ success: true, message: "Inventory item updated successfully", updatedInventoryItem });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

// Route to delete an inventory item
router.delete("/inventory-delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedInventoryItem = await Inventory.findByIdAndDelete(id);

        if (!deletedInventoryItem) {
            return res.status(404).json({ success: false, error: "Inventory item not found" });
        }

        res.status(200).json({ success: true, message: "Inventory item deleted successfully", deletedInventoryItem });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

// Route to get inventory data
router.get('/inventory-data', async (req, res) => {
    try {
        const inventoryData = await Inventory.find(); // Modify this query as needed

        // Send the data as a JSON response
        res.json(inventoryData);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'Error fetching inventory data', error: error.message });
    }
});

router.get('/countInventory', async (req, res) => {
    try {
        const InventoryCount = await Inventory.countDocuments();
        res.status(200).json({ count: InventoryCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to count Inventory' });
    }
});
module.exports = router;
