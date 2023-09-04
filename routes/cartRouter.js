const { Router } = require("express");
const { UserModel } = require("../models/User.model");
const { CartModel } = require("../models/Cart.model");

const CartRouter = Router();

//Get Method cart products
CartRouter.get("/product", async (req, res) => {
  try {
    const cart_items = await CartModel.find({ memberId: req.userId });

    if (!cart_items || cart_items.length === 0) {
      return res.status(200).json({ message: "cart is empty" });
    }

    res.status(200).json(cart_items);
  } catch (error) {
    console.error("Error while getting products from cart", error);
    res.status(500).send("Error while getting products from cart");
  }
});

//Post method
CartRouter.post("/add", async (req, res) => {
  try {
    console.log(req.body);

    const user = await UserModel.findById(req.userId);
    const cart_item = new CartModel({
      memberId: req.userId,
      product: req.body,
      quantity:1,
      total: req.body.finalPrice
    });
    if (user) {
      //   console.log("this is the user: ", user);
      await cart_item.save();

      res.status(200).send({"message": "success", "products": cart_item });
    }
  } catch (error) {
    console.log("Error while adding product into cart");

    res.status(404).send("Error while adding product into cart");
  }
});

//Delete: Cart product
CartRouter.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await CartModel.findOneAndDelete({
      memberId: req.userId,
      _id: id,
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error while deleting products from cart", error);
    res
      .status(500)
      .json({ message: "Error while deleting products from cart" });
  }
});

module.exports = { CartRouter };
