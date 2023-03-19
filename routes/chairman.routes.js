const { ChairmanLogin, changeChair, getAllChair } = require('../controllers/chairmen.controller')

const router = require('express').Router()

router.route('/')
        .get(getAllChair)
        .post(ChairmanLogin)
        .put(changeChair)

module.exports = router