const Invoice = require('../models/invoice');
const User = require('../models/user');

// Get all invoices for a user
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error });
  }
};

// Get a single invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice || invoice.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice', error });
  }
};
exports.createInvoice = async (req, res) => {
  try {
    const { items, discount = 0, tax = 0 } = req.body;
    const userId = req.user.id; // Adjust based on how you access user info

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required and must be an array' });
    }

    // Calculate total amount
    let totalAmount = items.reduce((sum, item) => {
      return sum + (item.total_price || 0);
    }, 0);

    totalAmount = totalAmount - discount + tax;

    if (isNaN(totalAmount)) {
      return res.status(400).json({ message: 'Calculated total amount is not a number' });
    }

    // Create new invoice
    const invoice = new Invoice({
      customer: userId,
      items,
      discount,
      tax,
      total_amount: totalAmount
    });

    await invoice.save();

    // Update user history
    const user = await User.findById(userId);
    if (user) {
      if (!Array.isArray(user.history)) {
        user.history = [];
      }
      user.history.push(invoice._id);
      await user.save();
    } else {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Error creating invoice', error: error.message || error });
  }
};

// Create a new invoice
// exports.createInvoice = async (req, res) => {
//   try {
//     const { items, discount , tax  } = req.body;
//     const userId = req.user.id; // Adjust based on how you access user info
    
//         const total_amount = items.reduce((sum, item) => sum + item.total_price, 0) - discount + tax;
//     // Validate items
//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: 'Items are required and must be an array' });
//     }

//     // Create new invoice
//     const invoice = new Invoice({
//       customer: userId,
//       items,
//       discount,
//       tax,
//       total_amount
//     });

//     await invoice.save();

//     // Update user history
//     const user = await User.findById(userId);
//     if (user) {
//       user.history.push(invoice._id);
//       await user.save();
//     } else {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(201).json({ message: 'Invoice created successfully', invoice });
//   } catch (error) {
//     console.error('Error details:', error); // Enhanced logging
//     res.status(500).json({ message: 'Error creating invoice', error: error.message || error });
//   }
// };

// exports.createInvoice = async (req, res) => {
//   try {
//     const { items, discount, tax } = req.body;
//     const id=token._id

//     // Calculate total amount

//     // Create new invoice
//     const invoice = new Invoice({
//       user: req.user.id,
//       items,
//       // discount,
//       // tax,
//       // total_amount
//     });

//     await invoice.save();
// // 
//     // Update user history
//     const user = await User.findById(req.user.id);
//     user.history.push(invoice._id);
//     await user.save();

//     res.status(201).json({ message: 'Invoice created successfully', invoice });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating invoice', error });
//   }
// };

// Update an existing invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, discount, tax } = req.body;

    const invoice = await Invoice.findById(id);
    if (!invoice || invoice.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update invoice items and calculate total amount
    invoice.items = items || invoice.items;
    invoice.discount = discount !== undefined ? discount : invoice.discount;
    invoice.tax = tax !== undefined ? tax : invoice.tax;
    invoice.total_amount = invoice.items.reduce((sum, item) => sum + item.total_price, 0) - invoice.discount + invoice.tax;

    await invoice.save();

    res.status(200).json({ message: 'Invoice updated successfully', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Error updating invoice', error });
  }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);
    if (!invoice || invoice.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await invoice.remove();

    // Update user history
    const user = await User.findById(req.user.id);
    user.history.pull(invoice._id);
    await user.save();

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invoice', error });
  }
};