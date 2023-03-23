const verifySession = (req, res, next) => {
 if(!req.session.user) return res.status(403).json({message:'403'})
 next()
}
const verifySecSession = (req, res, next) => {
 if(!req.session.secuser) return res.status(403).json({message:'403'})
 next()
}
const verifyRepSession = (req, res, next) => {
 if(!req.session.repid) return res.status(403).json({message:'403'})
 next()
} 

module.exports = {verifySession, verifySecSession, verifyRepSession}