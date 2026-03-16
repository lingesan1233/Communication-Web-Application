const router = require("express").Router()
const auth = require("../middleware/authMiddleware")
const User = require("../models/User")
const multer = require("multer")

/* FILE UPLOAD CONFIG */

const storage = multer.diskStorage({

destination:(req,file,cb)=>{
cb(null,"uploads/")
},

filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}

})

const upload = multer({storage})

/* SEARCH USERS */

router.get("/search", auth, async (req,res)=>{

try{

const search = req.query.search || ""

const users = await User.find({
name:{ $regex:search, $options:"i" },
_id:{ $ne:req.user.id }
}).select("-password")

res.json(users)

}catch(err){

console.error(err)
res.status(500).json({message:"Server error"})

}

})


/* GET PROFILE */

router.get("/profile", auth, async (req,res)=>{

try{

const user = await User.findById(req.user.id)
.select("-password")

res.json(user)

}catch(err){

console.error(err)
res.status(500).json({message:"Server error"})

}

})


/* UPDATE PROFILE */

router.put("/profile", auth, upload.single("profilePic"), async (req,res)=>{

try{

const {name,email} = req.body

let updateData = {name,email}

if(req.file){
updateData.profilePic = req.file.filename
}

const user = await User.findByIdAndUpdate(
req.user.id,
updateData,
{new:true}
).select("-password")

res.json(user)

}catch(err){

console.error(err)
res.status(500).json({message:"Server error"})

}

})

module.exports = router