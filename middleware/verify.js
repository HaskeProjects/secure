const verifySession = (req, res, next) => {
    
    if(parseInt(req.headers['role']) !== 2003) return res.status(403).json({message:'403'})
    next()
}
const verifySecSession = (req, res, next) => {
    if(parseInt(req.headers['role']) !== 2002) return res.status(403).json({message:'403'})
    next()
}
const verifyRepSession = (req, res, next) => {
 if(parseInt(req.headers['role']) !== 2001) return res.status(403).json({message:'403'})
 next()
} 

module.exports = {verifySession, verifySecSession, verifyRepSession}