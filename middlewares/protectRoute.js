const  User =require("../models/userModel.js")
const  jwt =require("jsonwebtoken")
const protectRoute = async (req, res, next) => {

    try {

        const  mateBatu  = req.cookies.mateBatu

        if (!mateBatu){

            return res.status(401).json({ error: "please login first" })

        }

        const decoded = jwt.verify(mateBatu, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId)

        if (!user) {

            return res.status(401).json({ error: "please login first" })

        }

        req.user = user

        next()

    } catch (error) {

        res.status(401).json({ error: "error in protecting route",details: error.message })

    }
}

module.exports= protectRoute