const Estates = require("../models/estates.model")

const getAllEs = (req, res) => {
    const data = Estates.find().lean()
    return res.json(data)
}

const addNewEs = async(req, res) => {
    const {name, location} = req.body
    const estate = new Estates({name, location})
    const data = await estate.save()
    return res.json(data)
}

const editEs = async(req, res) =>{
    const esId = req.body.orgId
    const newName = req.body.name
    const found = await Estates.findOne({_id: esId}).exec()
    if(!found) return res.json({message: 'Estate doesn\'t exist on our database'})
    found.name = newName
    const data = await found.save()
    return res.json(data)
}

const deleteEs = async(req,res) => {
    const esId = req.params.id
    const found = await Estates.findOne({_id: esId}).exec()
    if (!found) return res.status(404).json({message:"not found"})
    found.remove()
    const re= await found.save()
    return res.json(re)
}

const getSingleEs = async(req, res) => {
    const id = req.params.id 
    const found = await Estates.findOne({_id: id}).exec()
    if (!found) return res.status(404).json({message: "Not found"})
    return res.json(found)
}
 
module.exports = {getAllEs, addNewEs, editEs, deleteEs, getSingleEs}