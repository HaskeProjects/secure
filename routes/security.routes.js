const { getSecurity, LoginSec } = require('../controllers/security.controller')
const { verifySecSession } = require('../middleware/verify')

const router = require('express').Router()

router.route('/')
        .post(LoginSec)
        .get(verifySecSession, getSecurity)
        
module.exports = router