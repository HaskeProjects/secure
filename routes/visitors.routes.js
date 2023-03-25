const { getAllVisitors, createNewVisitor, getAllExpectedVisitors } = require('../controllers/visitors.controller')
const { verifyRepSession, verifySession } = require('../middleware/verify')
const verifyJWT = require('../middleware/verifyJWT')

const router = require('express').Router()

router.route('/')
        .post(verifyJWT, verifySession, createNewVisitor)
router.route('/:resId').get(getAllExpectedVisitors)
router.route('/:skip/:limit').get(verifyJWT, verifyRepSession, getAllVisitors)



module.exports = router