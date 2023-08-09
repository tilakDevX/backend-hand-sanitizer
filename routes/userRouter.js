const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { UserModel } = require("../models/User.model");



const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;

  const exist = await UserModel.find({ email });

  if (exist.length > 0) {
    console.log(exist);
    res.send({ message: "you are signup already." });
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
        res.status(200).send("Sign successfully.");
      } catch (error) {
        console.log("Failed to save into db", error);
        res.status(500).send("Failed to save into db");
      }
    });
  }
});

userRouter.post("/login", async (req, res)=>{
    const {email, password} = req.body;

    const user = await UserModel.findOne({email})
    if(!user){
        res.send({"message": " Please Sign Up"})
    }
    else{
        const hash = user.password;
        bcrypt.compare(password, hash, function(err, result) {
            // result == true

            if(result){
                const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

                res.status(200).send({"message":"Login successfully", token})


            }else{

                res.send("Login failed, invalid credentials")

            }
        });
    }
        

})

module.exports = { userRouter };
