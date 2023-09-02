const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  memberId: { type: String },
  product: {type: Object}
});
const CartModel = mongoose.model("cart", cartSchema);

module.exports = { CartModel };
