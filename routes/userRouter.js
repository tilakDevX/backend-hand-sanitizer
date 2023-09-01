const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();



const { UserModel } = require("../models/User.model");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;

  const exist = await UserModel.find({ email });

  if (exist.length > 0) {
    console.log(exist);
    res.send({ message: "You are signup already." });
  } else {
    bcrypt.hash(password, 5, async function (err, hash) {
      // Store hash in your password DB.

      if (err) {
        res.send({ message: "Error while hashing password" });
      }

      const user = new UserModel({
        name,
        email,
        password: hash,
      });

      try {
        await user.save();
        res.status(200).send({ message: "Sign in successfully." });
      } catch (error) {
        console.log("Failed to save into db", error);
        res.status(500).send({ message: "Failed to save into db" });
      }
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    res.send({ message: "Please Sign Up, Before Sign in" });
  } else {
    const hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      // result == true

      if (result) {
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

        // Set the token as a cookie
        res.cookie('authToken', token, {
          maxAge: 24 * 60 * 60 * 1000, // Expires in 1 day
          httpOnly: true, // Cookie cannot be accessed via JavaScript
          secure: true, // Use only on HTTPS
          sameSite: 'strict' // Restrict cookie to same-site requests
        });

        let user_detail = {
          name: user.name,
          email: user.email,
          role: user.role,
        };
        res
          .status(200)
          .send({ message: "Login successfully", user: user_detail, token });
      } else {
        res.send({ message: "Login failed, invalid credentials" });
      }
    });
  }
});

userRouter.post('/newpassword', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(404).send({ message: "Your account does not exist. Please sign up." });
    } else {
      bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
          res.status(500).send({ message: "Error while hashing password" });
        }

        user.password = hash;

        try {
          await user.save();
          res.status(200).send({ message: "Password updated successfully." });
        } catch (error) {
          console.log("Failed to save into db", error);
          res.status(500).send({ message: "Failed to update password" });
        }
      });
    }
  } catch (error) {
    console.log("Error while finding user", error);
    res.status(500).send({ message: "Error while finding user" });
  }
});


module.exports = { userRouter };
