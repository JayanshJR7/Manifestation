import jwt from "jsonwebtoken"

export const generateToken= (userID, res)=>{
    const token = jwt.sign({userID},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000, //its in milliseconds so , 7days in milliseconds is this
        httpOnly:true, //prevent xss attacks cross site scripting attacks , it is no longer avail through javascript
        sameSite:"strict", // CSRF attacks cross site request forgery attacks
        secure: process.env.NODE_ENV !=="development" //this says this is gonna be true if you are in production
    })

    return token;
}