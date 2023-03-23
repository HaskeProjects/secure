const { getAllVisitors, createNewVisitor, getAllExpectedVisitors } = require('../controllers/visitors.controller')
const { verifyRepSession, verifySession } = require('../middleware/verify')

const router = require('express').Router()

router.route('/')
        .post(verifySession, createNewVisitor)
router.route('/:resId').get(getAllExpectedVisitors)
router.route('/:skip/:limit').get(verifyRepSession, getAllVisitors)



module.exports = router