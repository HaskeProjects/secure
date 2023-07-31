    const Chair = require('../models/chairmen.model')
    const Vi = require('../models/visitors.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {body} = require('express-validator')
const estatesModel = require('../models/estates.model')
const testval = require('../utils/testval')
const randomizer = require('randomstring')
const sendSMS = require("../utils/sms")

const getAllChair = (req, res) => {
    return res.status(201).json({message: 'authorized'})
}

const ChairmanLogin = async(req, res) => {
    const {user, password} = req.body
    if(![user, password].every(Boolean)) return res.status(404).json({type:"incompleteinfo", message: 'user login credentials required'})
    const numregex = /^[0-9]{9,10}$/
    const tester = numregex.test(parseInt(user)) ? {number: parseInt(user)} :body(user).isEmail() ? {email: user} :  {number: 0}
    const found = await Chair.findOne(tester).exec()
    
    if(!found) return res.status(404).json({message: "not found"})
    const est = await estatesModel.findOne({_id: found.esId})
    const test = testval(est.end)
    if(!test) return res.status(403).json({message:'Estate Inactive'})
    const chpassword = password.toUpperCase()
    const match = await bcrypt.compare(chpassword, found.password)
    if(match){  
        const accessToken = jwt.sign(
            {userr: found.esId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30m'}
        )
        
        return res.status(201).json({id:found.esId, accessToken, type:est.type, role:2001})
    }
    else{
        return res.status(404).json({type:"wrongpass"})
    }
}

const changeChair = async(req, res) => {
    const {newChairFirstname, newChairLastname, newChairNumber, resetPass, chId} = req.body 
    if (!chId) return res.status(403)
    const found = await Chair.findOne({_id: chId}).exec()
    if(newChairFirstname) found.firstname = newChairFirstname
    if(newChairLastname) found.lastname = newChairLastname
    if(newChairNumber) found.number = newChairNumber
    if(resetPass) {
        const secpassword = randomizer.generate({length:3, charset: 'alphabetic',capitalization: 'uppercase'})+randomizer.generate({length:3,charset: 'hex',capitalization: 'uppercase'})
        const mes = `From ResidentProtect: \n Dear Estate Chairman/Representative. This is your new login ${secpassword}. Please use new chairman/Representative phone number where required.`
        const sechashed = await bcrypt.hash(secpassword, 10)
        found.password = sechashed
        sendSMS(found.number,mes)
    }
    const resp = await found.save()
    return res.status(201).json(resp)
}

const createOfficeVisitor = async(req, res) => {
    const esId = req.user
    const inviteCode = randomizer.generate({length:4, charset: 'hex',capitalization: 'uppercase'})+randomizer.generate({length:1,charset: 'alphabetic',capitalization: 'uppercase'})+randomizer.generate({length:1,charset: 'number',capitalization: 'uppercase'}) 
    const { number, name, pov } = req.body
    if(![number].every(Boolean)) return res.status(404).json({message: 'Please complete the fields'})
    
    const found = await Vi.findOne({number: number, name, pov, status: 'invited', esId})
      
    if(!found){
        const gen = new Vi({number, name, pov, esId: esId, resId:null, inviteCode })
        await gen.save()
        return res.status(201).json({message: inviteCode})
    }
    found.updatedAt = new Date()
    await found.save()
    return res.status(201).json({message: found.inviteCode})
}

module.exports = { getAllChair,createOfficeVisitor, ChairmanLogin, changeChair }