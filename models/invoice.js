const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require("./inventory"); // Importing the Inventory model (previously named Product)
const User = require("./user");

// Invoice Item Schema
const invoiceItemSchema = new Schema({

  // { type: Schema.Types.ObjectId, ref: 'invoice', required: true }// Correct reference to the Inventory model
  product: { type: Schema.Types.ObjectId, ref: 'Inventory' },

  // quantity: { type: Number },
  // price_per_unit: { type: Number }, // This will be auto-filled
  // total_price: { type: Number } // This will be auto-filled
});

// Invoice Schema
const invoiceSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'User' },
  items:[
    invoiceItemSchema
  ], 
  date: { type: Date, default: Date.now }, 
  total_amount: { type: Number }, // Auto-filled based on item prices
  payment_status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' }, 
  discount: { type: Number, default: 0 }, 
  tax: { type: Number, default: 0 }
});

// Pre-save middleware to auto-fill price fields
// invoiceSchema.pre('save', async function(next) {
//   try {
//     // Loop through each item in the invoice
//     for (const item of this.items) {
//       // Find the product using its ObjectId reference
//       const product = await Product.findById(item.product);
      
//       // Ensure the product exists
//       if (product) {
//         // Set the price per unit and calculate the total price
//         item.price_per_unit = product.price;
//         item.total_price = item.quantity * product.price;
//       } else {
//         // If product not found, throw an error
//         return next(new Error('Product not found for ID: ' + item.product));
//       }
//     }
    
//     // Calculate the total amount for the invoice
//     this.total_amount = this.items.reduce((sum, item) => sum + item.total_price, 0);
    
//     // Apply discount and tax (if needed)
//     this.total_amount = this.total_amount - this.discount + this.tax;

//     next();
//   } catch (err) {
//     next(err); // Handle any errors during the save operation
//   }
// });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
