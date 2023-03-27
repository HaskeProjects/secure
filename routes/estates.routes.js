const { getAllEs, addNewEs, editEs, deleteEs, getSingleEs, getEstateVisitors } = require('../controllers/estates.controller')
const router = require('express').Router()

router.route('/')
        .get(getAllEs)
        .post(addNewEs)
        .put(editEs)
        .delete(deleteEs)
router.route('/:id').get(getSingleEs).post(getEstateVisitors)

module.exports = router