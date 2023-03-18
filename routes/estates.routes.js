const { getAllEs, addNewEs, editEs, deleteEs, getSingleEs } = require('../controllers/estates.controller')

const router = require('express').Router()

router.route('/')
        .get(getAllEs)
        .post(addNewEs)
        .put(editEs)
        .delete(deleteEs)
     .route('/:id')

router.get(getSingleEs)