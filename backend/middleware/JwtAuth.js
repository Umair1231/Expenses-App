require('dotenv').config()
const jwt = require("jsonwebtoken");

const cookieJwtAuth = (req, res, next) =>
{
    //const token = req.cookies.AccessToken;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try
    {
        const user = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        next();
    } catch(err)
    {
        console.log("hello")
        return res.json({message: "Bad Token"});
    }
}


module.exports = cookieJwtAuth;