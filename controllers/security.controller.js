const securityModel = require("../models/security.model")
const bcrypt = require('bcrypt')
const visitorsModel = require("../models/visitors.model")
const estatesModel = require("../models/estates.model")
const Formidable = require('formidable')
const fsPromises = require('fs').promises
const randomizer = require('randomstring')
const path = require('path')
const jwt = require('jsonwebtoken')
const testval = require('../utils/testval')
const sendSMS = require("../utils/sms")

const getSecurity = async(req, res) => {
    const secId = req.user
    const sec = await securityModel.findOne({_id: secId }).lean().populate({path:'estate'})
    const expectedToCheckout =await visitorsModel.find({esId: sec.esId, status: 'checkedin'}).lean().populate({path:'invitedBy'})
    const checkOuts =await visitorsModel.find({esId: sec.esId, status: 'checkedout'}).lean().populate({path:'invitedBy'})
    return res.json({sec, checkOuts, expectedToCheckout})
}

const checkout = async(req, res) => {
    const {code} = req.headers
    const checkCode = await visitorsModel.findOne({inviteCode: code}).populate({path:'invitedBy'})
    if(!checkCode) return res.status(404).json({message: 'code doesn\'t exist.'})
    if(checkCode.status === 'invited'){
        return res.status(400).json({message:`This person has not been checked in`})    
    }
    else if(checkCode.status === 'checkedout'){
        return res.status(401).json({message:`This person has already been checked in and out`})    
    }
    checkCode.status = 'checkedout'
    checkCode.checkOut = new Date()
    await checkCode.save()
    return res.status(201).json(checkCode)
}

const checkin = async(req, res) => {

    const form =new Formidable.IncomingForm()
    const uploadsFolder = path.join(__dirname, '..', 'public')
    form.maxFileSize = 5 * 1024 * 1024
    form.uploadDir = uploadsFolder
    form.parse(req, async(err, fields, files)=>{
        const {code, name, pov, address} = fields
        if(!code) return res.status(404).json({message: 'params not found '}) 
        const checkCode = await visitorsModel.findOne({inviteCode: code}).populate({path:'invitedBy'})
        if(!checkCode) return res.status(404).json({message: 'code doesn\'t exist.'})

        if(checkCode.status === 'checkedout'){
            return res.status(401).json({message: 'This person has already been checked in and out'})
        }
        else if(checkCode.status === 'checkedin'){
            return res.status(401).json({message:`This person has already been checked in`})    
        }
        
        const file = files.files
        const filename = file.originalFilename
        try{
            fsPromises.rename(file.filepath, path.join(uploadsFolder, filename))    
            
            checkCode.status = 'checkedin'
            checkCode.checkIn = new Date()
            checkCode.image = filename
            checkCode.name = name
            checkCode.address = address
            checkCode.pov = pov

            await checkCode.save()
            return res.status(201).json(checkCode)  
        }catch(err){
            console.log(err)
                return res.status(500).json({error:err.message})
            }
    }) 
}

const LoginSec = async(req, res) => {
    const {user, password} = req.body
    const chuser = user.toLowerCase()
    const found = await securityModel.findOne({user:chuser}).exec()
    if(!found) return res.status(404).json({message: "credentials not found"})
    const est = await estatesModel.findOne({_id: found.esId})
    const test = testval(est.end)
    if(!test) return res.status(403).json({message:'Estate Inactive'})
        
    const chpassword = password.toUpperCase()
    const match = await bcrypt.compare(chpassword, found.password)
    if(match){  
        
        const accessToken = jwt.sign(
            {userr: found._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30m'}
        ) 
        return res.status(201).json({id:'', accessToken, role:2002})
    }
    else{
        return res.status(404).json({type:"wrongpass"})
    }
}

const resetSecurityDetails = async(req, res) => {
    const {chId} = req.body 
    if (!chId) return res.status(403).json({message:'Nothing to see here'})
    const found = await securityModel.findOne({esId: chId}).exec()
    if (!found) return res.status(403).json({message:'Nothing to see here'})
    const secpassword = randomizer.generate({length:3, charset: 'alphabetic',capitalization: 'uppercase'})+randomizer.generate({length:3,charset: 'hex',capitalization: 'uppercase'})
    const userid = randomizer.generate({length:3, charset: 'alphabetic',capitalization: 'lowercase'})+randomizer.generate({length:3, charset: 'hex',capitalization: 'lowercase'})
    const user = `rp@${userid}`
    const sechashed = await bcrypt.hash(secpassword, 10)
        const mes = `From ResidentProtect: \n Dear Chairman/Estate Representative, your estate's new guard login is Guard 1: ${user}, Guard 2: ${secpassword}.`
        found.password = sechashed
        found.user = user
        sendSMS(found.number, mes)
        await found.save()  
        return res.status(201).json({message:'sent'})
}

module.exports = {LoginSec, getSecurity, checkin, checkout, resetSecurityDetails}
