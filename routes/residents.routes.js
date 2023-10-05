const { getAllEstateRecidents, createNewRe, EditRe, deleteRe, requestRat, verifyRat, getSingleRe, getResidentVisitors, addDependants, updateDependant, deleteDependant, getDependants } = require('../controllers/residents.controller')
const { verifySession, verifyRepSession } = require('../middleware/verify')
const verifyJWT = require('../middleware/verifyJWT')

const router = require('express').Router()

router.route('/')
        .post(verifyJWT, verifyRepSession, createNewRe)
        .put(verifyJWT,verifyRepSession, EditRe)
        
router.route('/single')
        .get(verifyJWT,verifySession, getSingleRe)
router.route('/visitor')
        .get(verifyJWT,verifySession, getResidentVisitors)
router.route('/dependant')
        .get(verifyJWT, verifySession, getDependants)
        .post(verifyJWT, verifySession, addDependants)
        .put(verifyJWT, verifySession, updateDependant)
        .delete(verifyJWT, verifySession, deleteDependant)
router.route('/:number')
        .get(requestRat)
        .post(verifyRat)
        .delete(verifyJWT,verifyRepSession, deleteRe)
router.route('/:skip/:limit').get(verifyJWT, verifyRepSession, getAllEstateRecidents)


module.exports = router