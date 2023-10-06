const { getSecurity, LoginSec, checkin, checkout, resetSecurityDetails, ncheckin, verifyReAndDe } = require('../controllers/security.controller')
const { verifySecSession } = require('../middleware/verify')
const verifyJWT = require('../middleware/verifyJWT')

const router = require('express').Router()

router.route('/')
        .post(LoginSec)
        .put(resetSecurityDetails)
        .get(verifyJWT, verifySecSession, getSecurity)
router.route('/checkin')
        .post(verifyJWT, verifySecSession,checkin)
        .put(verifyJWT, verifySecSession,verifyReAndDe)
router.route('/ncheckin').post(verifyJWT, verifySecSession,ncheckin)
router.route('/checkout').post(verifyJWT, verifySecSession,checkout)
module.exports = router