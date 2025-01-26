const express=require('express')

const app=express()
let friendData=require("./Model/friends.model")
let userCollection=require("./Model/users.model")
let cors=require('cors')
let bodyParser=require('body-parser')
let cookieParser=require('cookie-parser')
let jwt=require("jsonwebtoken")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())
const mongooes=require('mongoose')

mongooes.connect('mongodb+srv://virat:virat1877@cluster0.dol0p.mongodb.net/mydatabase?retryWrites=true&w=majority').then(()=>{console.log("okay")}).catch((err)=>{console.log(err)})

app.get("/", async (req, res) => {
  try {
    // Extract the Authorization header
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res.status(400).json({ message: "Authorization header is missing" });
    }

  
    // Extract the token after 'Bearer'
    const token = authorizationHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) {
      return res.status(400).json({ message: "Token is missing in Authorization header" });
    }

    // Verify the JWT token
    const decoded = await jwt.verify(token, "secreat"); // 'secreat' is your secret key
    console.log("Decoded Token:", decoded);

    // Query data from the database (example)
    const result = await friendData.find({});
    res.status(200).json(result);
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});
app.post("/login",async(req,res)=>{

  try{
  const isUSer=await userCollection.findOne({ username: req.body.username })

if(isUSer){



if(isUSer.password===req.body.password){
  let token=jwt.sign(req.body,"secreat")
  res.status(200).json({message:"ok",login:true,token})
}else{
  res.status(400).json({message:"invalid password",login:false})
}


}
else{
  res.status(400).json({message:"invalid Username or password",login:false})

}}
catch(err){
res.status(400).json({message:"Error At Server",login:false})
}



})

app.post("/signin", async (req, res) => {
  try {
    // Check if the user already exists
    const isAlreadyUserThere = await userCollection.findOne({ username: req.body.username })

    if (isAlreadyUserThere) {
      return res.status(400).json({ message: "Choose another username" });
    }

    // Hash the password using bcrypt
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user and save it
    const newUser = new userCollection({
      username: req.body.username,
      password: req.body.password,
    });

    await newUser.save();
   

    res.status(201).json({ username: req.body.username,message:"Successfully Register"});
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});




app.post("/addfriend",async(req,res)=>{
    let reqdata=req.body
  try{
    let newFriend=new friendData({...reqdata})
    await newFriend.save()
    res.status(201).json(newFriend);

  }
  catch (err){
    res.status(400).json({
        message:err.message
    })

  }


    })
    app.delete("/", async (req, res) => {
      console.log(req.body);
      try {
        const deletedItem = await friendData.findByIdAndDelete(req.body.id);
        if (!deletedItem) {
          return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: `Deleted ${deletedItem.name} with ID: ${deletedItem._id}` });
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Something went wrong on the server" });
      }
    });
    
//searching.................route
app.get("/search", async (req, res) => {
    

  
    if (req.query.name) {
    
      let searchStr = `${req.query.name.split(' ').join('.*')}`;  //
  
      try {
        // Perform the search using the regex pattern with case-insensitive option
        const searchData = await friendData.find({
          name: { $regex: searchStr, $options: 'i' } // 'i' for case-insensitive search
        });
  
      
        console.log(searchData);
        res.json(searchData); 
  
      } catch (error) {
        
        console.error(error);
        res.status(500).send('Error performing search');
      }
    } else {
     
      console.log("Required name query parameter is missing");
      res.status(400).send("Name query parameter is required");
    }
  });
  
   






app.listen(7778,()=>{
    console.log("server running on 7778")
})