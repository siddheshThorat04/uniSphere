const User =require("../models/userModel")
const bcrypt=require("bcryptjs")
const generateTokenAndSetCookie=require("../utils/generateTokenAndSetCookie.js")
const signup =async (req,res)=>{
    try {
        const { username, college } = req.body
        const user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({ error: "user already exists" })
        }
        let isAdmin = false
        if(username === "Admin" || username === "siddhesh" ) {isAdmin = true}
        const newUser = new User({
            username, 
            college,
            isAdmin
        })
        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()
            res.status(200).json({message:"signed up succefully ",user:newUser })
            
        }
    } catch (error) {
        
        res.status(400).json({error:error.message})
    }
}
    const login = async (req, res) => {
        try {
            const { username, password } = req.body
            if (!username || !password) {
                res.status(400).json({ error: "all fields are required" })
            }
            const user = await User.findOne({ username })

            if (!user) {
                return res.status(400).json({ error: "user not found" })
            }
            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (!isPasswordCorrect) {
                return res.status(400).json({ error: "wrong password" })
            }
            generateTokenAndSetCookie(user._id, res)
            res.status(200).json({message:"logged in successfully", user})
        } catch (error) {
            res.status(400).json({error:error.message})
        }
    }
const logout = async (req, res) => {
    try {
        res.cookie("mateBatu", "", {
            httpOnly: true,
            expires: new Date(0),
            secure: true,
            sameSite: "none"    
        })
        res.status(200).json({message:"logged out successfully"})
    } catch (error) {
        res.status(400).json("error in logging out", error.message)
    }

}

module.exports={signup,login,logout}