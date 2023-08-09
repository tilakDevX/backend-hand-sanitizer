const {Router} = require("express");

const {ProductModel} = require("../models/Product.model")
const {UserModel} = require("../models/User.model")



const ProductRouter = Router();





ProductRouter.get("/", async (req, res)=>{

    let filters = {};
    if (req.query.category) {
        filters.category = req.query.category;
    }

    if (req.query.author) {
        filters.author = req.query.author;
    }

    const blogs = await ProductModel.find(filters);

    res.send({"message": "your blogs", "blog":blogs})
})


ProductRouter.post("/create", async(req,res)=>{

    const {title, category, content,image,email} = req.body;
    console.log(req.body)

    const userId = req.userId;
    console.log(userId)
    const user = await UserModel.findOne({_id: userId})

    const new_blog = new ProductModel({
        title,
        category,
        content,
        image,
        email:user.email,
        author: user.name,
        

    })
    console.log(new_blog)
    await new_blog.save();
    res.status(200).send("Blog Created")

    


})

ProductRouter.delete("/delete/:blogID", async(req,res)=>{

    const blogID = req.params.blogID;


    const user_id = req.userId;

    const user = await UserModel.findOne({_id: user_id})

    const user_email = user.email;

    const blog = await ProductModel.findOne({_id: blogID})


    const blog_author_email = blog.email;


    if(user_email != blog_author_email){
        res.send({"message": "you are not authorized"})
    }else{
        await ProductModel.findByIdAndDelete(blogID)
        res.send(`blog ${blogID} deleted`)
    }
})
ProductRouter.put("/edit/:blogID", async(req,res)=>{

    const blogID = req.params.blogID;

    const payload  = req.body;

    const user_id = req.userId;

    const user = await UserModel.findOne({_id: user_id})

    const user_email = user.email;

    const blog = await ProductModel.findOne({_id: blogID})


    const blog_author_email = blog.email;

    // console.log(user_email,blog_author_email,blog)


    if(user_email != blog_author_email){
        res.send({"message": "you are not authorized"})
    }else{
        await ProductModel.findByIdAndUpdate(blogID, payload)
        res.send(`blog ${blogID} updated`)
    }
})

module.exports = {ProductRouter}