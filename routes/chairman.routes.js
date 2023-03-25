const { ChairmanLogin, changeChair, getAllChair } = require('../controllers/chairmen.controller')
const { verifyRepSession } = require('../middleware/verify')
const verifyJWT = require('../middleware/verifyJWT')

const router = require('express').Router()

router.route('/')
        .get(verifyJWT, verifyRepSession, getAllChair)
        .post( ChairmanLogin)
        .put(changeChair)

module.exports = router