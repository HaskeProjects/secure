const { ChairmanLogin, changeChair, getAllChair, createOfficeVisitor } = require('../controllers/chairmen.controller')
const { verifyRepSession } = require('../middleware/verify')
const verifyJWT = require('../middleware/verifyJWT')

const router = require('express').Router()

router.route('/')
        .get(verifyJWT, verifyRepSession, getAllChair)
        .post( ChairmanLogin)
        .put(changeChair)
router.route('/in')
        .post(verifyJWT, verifyRepSession, createOfficeVisitor)

module.exports = router