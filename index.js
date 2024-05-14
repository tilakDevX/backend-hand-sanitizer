const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connection } = require("./config/db");
// const { authentication } = require("./middleWares/authentication");
const { userRouter } = require("./routes/userRouter");
const { ProductRouter } = require("./routes/productRouter");
const { CartRouter } = require("./routes/cartRouter");
const { authentication } = require("./middleWares/authentication");
const { OrderedProductRouter } = require("./routes/orderProductRouter");

const app = express();
app.use(express.json());
// const corsOptions = {
//   origin: ["http://127.0.0.1:5173/"],
// };

// app.use(cors(corsOptions));
app.use(cors());

app.get("/", (req, res) => {
  res.send("HomePage.");
});

app.use("/user", userRouter);
app.use("/products", ProductRouter);
app.use("/user/cart", authentication, CartRouter);
app.use("/user/ordered_product", authentication, OrderedProductRouter);

app.use((req, res) => {
  res.status(404).send("The URL or Endpoint not exist, Please try again");
});
let PORT = 8500;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to db.");
  } catch (error) {
    console.log("Failed to connect db server.");
    console.log(error);
  }
  console.log(`Server started on port ${PORT}`);
});
