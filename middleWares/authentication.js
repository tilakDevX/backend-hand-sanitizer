const jwt = require('jsonwebtoken');
require("dotenv").config()


const authentication = (req,res, next)=>{

    const token = req.headers.authorization?.split(" ")[1]
    // console.log(token)

    if(!token){
        res.send({"message": "Please Login"})
    }else{
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {

            if(err){
                res.send({"message": "Please Login With Correct Crediential"})
            }else{
                const userId = decoded.userId

                req.userId = userId;

                next();
            }


          });
    }
}

module.exports = {authentication}