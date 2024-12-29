const mongoose =require("mongoose");

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    leadboard:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
})  

const College=mongoose.model('College', collegeSchema) 
module.exports=College