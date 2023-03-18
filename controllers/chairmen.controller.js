const Chair = require('../models/chairmen.model')

const getAllChair = (req, res) => {
    const data = Chair.find().lean()
    return res.json(data)
}

const createNewChair = async(req, res) => {
    const {name, esId, number} = req.body
    const estate = new Chair({name, esId, number})
    const data = await estate.save()
    return res.json(data)
}

const changeChair = async(req, res) => {
    const {newChairName, newChairNumber, chId} = req.body 
    if (!chId) return res.status(403)
    const found = await Chair.findOne({_id: chId}).exec()
    found.name = newChairName
    found.number = newChairNumber
    const res = await found.save()
    return res.json(res)
}

module.exports = {getAllChair, getEstateChair, createNewChair, changeChair}