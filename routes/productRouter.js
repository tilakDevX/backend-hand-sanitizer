const { Router } = require("express");

const { ProductModel } = require("../models/Product.model");
const { authentication } = require("../middleWares/authentication");

const ProductRouter = Router();

// Get   endpoint to get all products
ProductRouter.get("/", async (req, res) => {
  let query = ProductModel.find();

  // Apply sorting based on the 'sort' query parameter
  if (req.query.sort === "priceLowToHigh") {
    query = query.sort({ MRP: 1 }); // Sort by 'finalPrice' field in ascending order
  } else if (req.query.sort === "priceHighToLow") {
    query = query.sort({ MRP: -1 }); // Sort by 'finalPrice' field in descending order
  }

  // Apply filtering based on the 'brand' query parameter
  if (req.query.brand) {
    const brandRegex = new RegExp(req.query.brand, "i");
    query = query.where({ brand: brandRegex });
  }

  // Pagination logic - you can modify this as needed
  const limit = parseInt(req.query._limit);
  const page = parseInt(req.query._page) || 1;
  const skip = (page - 1) * limit;

  try {
    let totalProductsQuery = ProductModel.find();

    // Apply filtering based on the 'brand' query parameter for total count
    if (req.query.brand) {
      const brandRegex = new RegExp(req.query.brand, "i");
      totalProductsQuery = totalProductsQuery.where({ brand: brandRegex });
    } else {
      totalProductsQuery = ProductModel.find();
    }
    const totalProducts = await totalProductsQuery.countDocuments();

    const products = await query.skip(skip).limit(limit).exec();

    res.send({
      message: "Successfully Got Data",
      product: products,
      totalCount: totalProducts,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching data", error: error.message });
  }
});

ProductRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      res.status(404).send("Product Not Found");
    } else {
      res.send(product);
    }
  } catch (error) {
    console.log("An error while find product by id ");
    console.log(error);

    res
      .status(501)
      .send({ message: "An error while find product by id ", error });
  }
});

// Post or Create endpoint to create a product
ProductRouter.post("/create", authentication, async (req, res) => {
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
ProductRouter.delete("/delete/:productID", authentication, async (req, res) => {
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
ProductRouter.put("/edit/:productID", authentication, async (req, res) => {
  console.log(req.body);
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
