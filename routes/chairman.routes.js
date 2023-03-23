const { ChairmanLogin, changeChair, getAllChair } = require('../controllers/chairmen.controller')
const { verifyRepSession } = require('../middleware/verify')

const router = require('express').Router()

router.route('/')
        .get(verifyRepSession, getAllChair)
        .post( ChairmanLogin)
        .put(changeChair)

module.exports = router