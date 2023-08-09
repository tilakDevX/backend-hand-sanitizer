const { Router } = require("express");

const { ProductModel } = require("../models/Product.model");
 

const ProductRouter = Router();

// Get   endpoint to get all products
ProductRouter.get("/", async (req, res) => {
  const products = await ProductModel.find();

  res.send({ message: "Successfully Got Data", product: products });
});

// Post or Create endpoint to create a product  
ProductRouter.post("/create", async (req, res) => {
  const { brand, MRP, finalPrice, img } = req.body;
  console.log(req.body);
 

  const new_product = new ProductModel({
    brand,
    MRP,
    finalPrice,
    img,
  });
  console.log(new_product);
  await new_product.save();
  res.status(200).send("Product Created");
});

// DELETE endpoint to delete a product by its ID
ProductRouter.delete("/delete/:productID", async (req, res) => {
  try {
    const productID = req.params.productID;
    const deletedProduct = await ProductModel.findByIdAndDelete(productID);
    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting product" });
  }
});

// PUT endpoint to edit a product by its ID
ProductRouter.put("/edit/:productID", async (req, res) => {
    console.log(req.body)
  try {
    const productID = req.params.productID;
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productID,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.send(updatedProduct);
  } catch (error) {
    res.status(500).send({ message: "Error updating product" });
  }
});
module.exports = { ProductRouter };
