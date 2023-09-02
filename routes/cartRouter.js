const { Router } = require("express");
const { UserModel } = require("../models/User.model");
const { CartModel } = require("../models/Cart.model");

const CartRouter = Router();

CartRouter.post("/", async (req, res) => {
  try {
    console.log(req.body);

    const user = await UserModel.findById(req.userId);
    const cart_item = new CartModel({
      memberId: req.userId,
      product: req.body,
    });
    if (user) {
      //   console.log("this is the user: ", user);
        await cart_item.save();

      res.status(200).send({"Cart item": cart_item});
    }
  } catch (error) {
    console.log("Please login first to add product into cart");

    res.status(404).send("Please login first to add product into cart");
  }
});




module.exports = { CartRouter };
