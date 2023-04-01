const { getAllEs, addNewEs, editEs, deleteEs, getSingleEs, getEstateVisitors, renewSubscription } = require('../controllers/estates.controller')
const router = require('express').Router()

router.route('/')
        .get(getAllEs)
        .post(addNewEs)
        .put(editEs)
        
router.route('/:id').get(getSingleEs).post(getEstateVisitors).put(renewSubscription).delete(deleteEs)

module.exports = router