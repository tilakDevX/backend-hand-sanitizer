const { Router } = require("express");

// const { ProductModel } = require("../models/Product.model");
const { OrderedProductModel } = require("../models/Ordered_Product.model");
const { authentication } = require("../middleWares/authentication");

const OrderedProductRouter = Router();

// Post your orderd products here
OrderedProductRouter.post(
  "/ordered_product",
  authentication,
  async (req, res) => {
    const { brand, MRP, finalPrice, img,orderedDate } = req.body;
    console.log(req.body);

    const new_product = new OrderedProductModel({
      brand,
      MRP,
      finalPrice,
      img,
      orderedDate,
    });
    console.log(new_product);
    await new_product.save();
    res.status(200).send("Product ordered successfully.");
  }
);
module.exports = { OrderedProductRouter };
