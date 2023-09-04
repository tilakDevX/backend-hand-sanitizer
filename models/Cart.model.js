const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  memberId: { type: String },
  product: {type: Object},
  quantity: {type: Number},
  total: {type: Number}
});
const CartModel = mongoose.model("cart", cartSchema);

module.exports = { CartModel };
