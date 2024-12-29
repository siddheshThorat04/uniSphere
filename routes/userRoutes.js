const express=require("express")
const { getMeet, getNews, getEvents, updateProfile,getProfile } = require("../controllers/userController.js")
const  protectRoute  = require("../middlewares/protectRoute")
const News =require("../models/newsModel.js")
const Event =require("../models/eventModel.js")
const multer =require('multer')
const multerS3 = require('multer-s3')

const router=express.Router()
//AWS PART

const {S3Client}=require("@aws-sdk/client-s3")

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.ACCESS_ID,
    secretAccessKey: process.env.ACCESS_KEY,
  },
});

const myBucket=process.env.BUCKET_NAME;


var upload=multer({
    storage:multerS3({
        s3:s3,
        bucket:myBucket,
        contentType:multerS3.AUTO_CONTENT_TYPE,
        key:(req,file,cb)=>{
            cb(null,file.originalname)
        }
    })
})
router.get("/getMeet",protectRoute,getMeet)

router.post("/addNews",upload.single("image"),protectRoute,async(req,res)=>{
    try {
        // console.log(req.body);   
        // console.log(req.file);  
        // console.log(req.file.location);
        const {title,description,isForAll}=req.body
        const image=req.file ? req.file.location:""
        const news=new News({title,description,isForAll,college:req.user.college,postedBy:req.user._id,image:image })
        req.user.contributions+=1
        await news.save()
        await req.user.save()
        res.status(200).json({news})

    } catch (error) {
        res.status(400).json({error:error.message})
        
    }
})
router.post("/addEvent",upload.single("image"),protectRoute,async(req,res)=>{
    try {
        const {Name,description,isForAll}=req.body
        const college=req.user.college
        const image=req.file ? req.file.location:""
        const event=new Event({Name,description,college,isForAll,image:image})
        await event.save()
        res.status(200).json({event})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})
router.get("/getNews",protectRoute,getNews)
router.get("/getEvents",protectRoute,getEvents)
router.post("/updateProfile",protectRoute,updateProfile)
router.get("/getProfile/:id",getProfile)
module.exports=router  