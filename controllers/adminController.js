
const  College =require ("../models/collegeModel.js")
const Meet =require("../models/meetModel.js")
const User =require("../models/userModel.js")
const News=require("../models/newsModel.js")
const Event=require("../models/eventModel.js")
 const addCollege = async (req, res) => {
    try {

        
        const { name } = req.body
        const college = new College({ name })
        await college.save()

        res.status(200).json(college)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const addMeet = async (req, res) => {
    try {
        
        const { name, link } = req.body

        const meet = new Meet({ name, link })

        res.status(200).json(meet)
        await meet.save()
    } catch (error) {
        res.status(400).json({error:error.message})
    }

}

const getColleges = async (req, res) => {
    try {
        const colleges = await College.find()
        res.status(200).json(colleges)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
const deleteMeet = async (req, res) => {
    try {
        const meet = await Meet.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Meet Deleted"})     
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
const deleteNews = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"News Deleted"})     
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
const getLeadboard = async (req, res) => {
    try {
        const leaboard=await User.find().sort({contributions:-1}).limit(3).populate("college")
        res.status(200).json(leaboard)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Event Deleted"})     
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
module.exports={addCollege,addMeet,getColleges,deleteMeet,getLeadboard,deleteNews,deleteEvent}