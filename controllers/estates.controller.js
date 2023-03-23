const Chair = require("../models/chairmen.model")
const Estates = require("../models/estates.model")
const Security = require("../models/security.model")
const randomizer = require('randomstring')
const bcrypt = require('bcrypt')
const sendSMS = require("../utils/sms")
const getAllEs = async(req, res) => {
    const data = await Estates.find().lean()
    return res.json(data)
}
// JPGJD567

const addNewEs = async(req, res) => {
    const {name, location, chfname, chlname, number, email} = req.body
    const cn =await Chair.findOne({number: number})
    const ce =await Chair.findOne({email: email})
    if(![name, location, chfname, chlname, number, email].every(Boolean)) return res.status(404).json({message: 'Incomplete credentials'})
    if(cn|| ce) return res.status(409).json({message:'duplicate number or email'})
    const estate = new Estates({name, location})
    const data = await estate.save()
    const password = randomizer.generate({length:5, charset: 'alphabetic',capitalization: 'uppercase'})+randomizer.generate({length:3,charset: 'hex',capitalization: 'uppercase'})
    const secpassword = randomizer.generate({length:5, charset: 'alphabetic',capitalization: 'uppercase'})+randomizer.generate({length:3,charset: 'hex',capitalization: 'uppercase'})
    const userid = randomizer.generate({length:8, charset: 'hex',capitalization: 'lowercase'})
    const user = `user@${userid}.ipss`
    const hashed = await bcrypt.hash(password, 10)
    const sechashed = await bcrypt.hash(secpassword, 10)
    const chair = new Chair({firstname: chfname, lastname: chlname, esId:data._id, number, password: hashed, email})
    const sec = new Security({name: `${name} security`, user, esId:data._id, password: sechashed})
    await chair.save()
    await sec.save()
    const mes = `Hello, as representative of "${name}". Your password for IPSS is ${password}. Please keep it safe.`
    sendSMS(number, mes)
    const mes2 = `Hello, Mr/Mrs ${chfname}. The security details for the estate you're representing is user: ${user}, password: ${secpassword}`
    sendSMS(number, mes2)
    return res.json({password, secpassword, user, number})
}

const editEs = async(req, res) => {
    const esId = req.body.esId                                                                                                                                  
    const newName = req.body.name
    const location = req.body.location
    const found = await Estates.findOne({_id: esId}).exec()
    if(!found) return res.json({message: 'Estate doesn\'t exist on our database'})
    found.name = newName
    found.location = location
    const data = await found.save()
    return res.json(data)
}

const deleteEs = async(req,res) => {
    const esId = req.body.id
    const found = await Estates.findOne({_id: esId}).exec()
    if (!found) return res.status(404).json({message:"not found"})
    found.remove()
    const re= await found.save()
    return res.json(re)
}

const getSingleEs = async(req, res) => {
    const id = req.params?.id 
    if (!id) return res.status(403)
    const found = await Estates.findOne({_id: id}).lean().populate({path: "chairman residentCount totalVisits totalSignin totalExpected vi re"})
    if (!found) return res.status(404).json({message: "Not found"})
    return res.json(found)
}
 
module.exports = {getAllEs, addNewEs, editEs, deleteEs, getSingleEs}