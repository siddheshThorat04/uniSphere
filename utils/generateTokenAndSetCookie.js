const  jwt =require("jsonwebtoken")

const generateTokenAndSetCookie = (userId,res) => {
    const token= jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"15d"
    })
    res.cookie("mateBatu",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge: 1000 * 60 * 60 * 24 * 15
    })

}

module.exports= generateTokenAndSetCookie