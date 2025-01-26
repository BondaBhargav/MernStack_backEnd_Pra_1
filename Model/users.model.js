

const mongoose=require('mongoose')
let usersSchema=new mongoose.Schema({
username:{type:String, required: true, unique: true,minlenth:3},
password:{type:String,required:true,minlenth:3}

})

const user=mongoose.model("user",usersSchema)

module.exports=user
