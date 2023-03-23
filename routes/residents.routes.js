const { getAllEstateRecidents, createNewRe, EditRe, deleteRe, requestRat, verifyRat, getSingleRe } = require('../controllers/residents.controller')
const { verifySession, verifyRepSession } = require('../middleware/verify')

const router = require('express').Router()

router.route('/')
        .post(verifyRepSession, createNewRe)
        .put(verifyRepSession, EditRe)
        
router.route('/single')
        .get(verifySession, getSingleRe)
router.route('/:number')
        .get(requestRat)
        .post(verifyRat)
        .delete(verifyRepSession, deleteRe)
router.route('/:skip/:limit').get(verifyRepSession, getAllEstateRecidents)


module.exports = router