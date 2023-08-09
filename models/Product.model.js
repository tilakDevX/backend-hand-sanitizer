const mongoose = require("mongoose")


const productSchema = mongoose.Schema(
    {
        brand:{type:String, required:true},
        MRP :{type:Number, required:true},
        finalPrice :{type:Number, required:true},
        img:{type:String, required:true},
       
    }
)
const ProductModel = mongoose.model("product", productSchema);


module.exports = {ProductModel}