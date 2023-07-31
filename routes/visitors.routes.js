const { getAllVisitors, createNewVisitor, getAllExpectedVisitors, getSingleVisitor, getEnqVis } = require('../controllers/visitors.controller')
const { verifyRepSession, verifySession, verifySecSession } = require('../middleware/verify')
const verifyJWT = require('../middleware/verifyJWT')

const router = require('express').Router()

router.route('/')
        .get(verifyJWT, verifySecSession, getEnqVis)
        .post(verifyJWT, verifySession, createNewVisitor)
router.route('/:resId').get(getAllExpectedVisitors).post(verifyJWT, verifySecSession, getSingleVisitor)
router.route('/:skip/:limit').get(verifyJWT, verifyRepSession, getAllVisitors)



module.exports = router