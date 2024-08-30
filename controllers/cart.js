const Cart = require('../models/cart');
const Inventory = require('../models/inventory');


exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.addItemToCart = async (req, res) => {
  const { productId,quantity} = req.body;
//   console.log(productId)

  try {
    const product = await Inventory.findById(productId);
    // console.log(product)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log("user id is "+ req.body._id )
    // cosnole.log("heloo")
    let cart = await Cart.findOne({ userId: req.user._id });
    // console.log(cart)

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        let item = cart.items[itemIndex];
        item.quantity += quantity;
        item.total = item.quantity * product.price;
        cart.items[itemIndex] = item;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          quantity:quantity,
          price: product.price,
          total: product.price * quantity,
        });
      }
    } else {
      cart = new Cart({
        // userId: req.user._id,
        items: [{
          productId,
          name: product.name,
          quantity,
          price: product.price,
          total: product.price * quantity,
        }],
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].total = quantity * cart.items[itemIndex].price;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
