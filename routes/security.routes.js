const { getSecurity, LoginSec, checkin, checkout } = require('../controllers/security.controller')
const { verifySecSession } = require('../middleware/verify')
const verifyJWT = require('../middleware/verifyJWT')

const router = require('express').Router()

router.route('/')
        .post(LoginSec)
        .get(verifyJWT, verifySecSession, getSecurity)
router.route('/checkin').post(verifyJWT, verifySecSession,checkin)
router.route('/checkout').post(verifyJWT, verifySecSession,checkout)
module.exports = router