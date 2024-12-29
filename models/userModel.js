const mongoose =require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    contributions:{
        type:Number,
        default:0
    },
    instagramLink: {
        type: String,
    }               
}, { timestamps: true })


const User = mongoose.model('User', userSchema)
module.exports=User