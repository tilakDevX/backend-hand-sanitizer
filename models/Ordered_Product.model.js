const mongoose = require("mongoose")


const orderedProductSchema = mongoose.Schema(
    {
        brand:{type:String, required:true},
        MRP :{type:Number, required:true},
        finalPrice :{type:Number, required:true},
        img:{type:String, required:true},
        orderedDate: { type: Date, default: Date.now }
       
    }
)
const OrderedProductModel = mongoose.model("ordered_product", orderedProductSchema);


module.exports = {OrderedProductModel}