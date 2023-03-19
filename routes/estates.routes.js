const { getAllEs, addNewEs, editEs, deleteEs, getSingleEs } = require('../controllers/estates.controller')
const router = require('express').Router()

router.route('/')
        .get(getAllEs)
        .post(addNewEs)
        .put(editEs)
        .delete(deleteEs)
router.route('/:id').get(getSingleEs)

module.exports = router