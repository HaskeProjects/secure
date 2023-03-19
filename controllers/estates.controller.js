const Chair = require("../models/chairmen.model")
const Estates = require("../models/estates.model")
const randomizer = require('randomstring')
const bcrypt = require('bcrypt')
const getAllEs = async(req, res) => {
    const data = await Estates.find().lean()
    return res.json(data)
}
// JPGJD567

const addNewEs = async(req, res) => {
    const {name, location, chfname, chlname, number, email} = req.body
    const estate = new Estates({name, location})
    const data = await estate.save()
    const password = randomizer.generate({length:5, charset: 'alphabetic',capitalization: 'uppercase'})+randomizer.generate({length:3,charset: 'hex',capitalization: 'uppercase'})
    console.log(password)
    const hashed = await bcrypt.hash(password, 10)
    const chair = new Chair({firstname: chfname, lastname: chlname, esId:data._id, number, password: hashed, email})
    await chair.save()
    return res.json({data, chair})
}

const editEs = async(req, res) => {
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