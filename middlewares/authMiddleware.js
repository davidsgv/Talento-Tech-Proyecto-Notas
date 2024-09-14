const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next)=>{
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if(!token) return res.status(401).json({message: "no token"})
    
    try{
        const decoded = jwt.verify(token, "secretKey");
        req.user = decoded;
        next();
    } catch(error){
        res.status(401).json({message: "Token not valid"})
    }
}

module.exports = authMiddleware;