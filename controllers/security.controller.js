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
const chairmenModel = require("../models/chairmen.model")
const dependantsModel = require("../models/dependants.model")
const residentsModel = require("../models/residents.model")

const getSecurity = async(req, res) => {
    const secId = req.user
    const sec = await securityModel.findOne({_id: secId }).lean().populate({path:'estate'})
    const expectedToCheckout =await visitorsModel.find({esId: sec.esId, status: 'checkedin'}).lean().populate({path:'invitedBy'})
    const checkOuts =await visitorsModel.find({esId: sec.esId, status: 'checkedout'}).lean().populate({path:'invitedBy'})
    return res.json({sec, checkOuts, expectedToCheckout})
}

const checkout = async(req, res) => {
    const {code} = req.headers
    const user = req.user
    const n2 = !parseInt(code) ? 1234 : parseInt(code)

    const sec = await securityModel.findOne({_id:user})
    const checkCode = await visitorsModel.findOne({
        $or: [
          { inviteCode: code, esId:sec.esId, status:'checkedin' },
          { number: n2, esId:sec.esId, status:'checkedin' }
        ]
      }).populate({path:'invitedBy'})
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
    const user = req.user
    const sec = await securityModel.findOne({_id:user})

    const form =new Formidable.IncomingForm()
    const uploadsFolder = path.join(__dirname, '..', 'public')
    form.maxFileSize = 5 * 1024 * 1024
    form.uploadDir = uploadsFolder
    form.parse(req, async(err, fields, files)=>{
        const {code, name, pov, address} = fields
        const n2 = !parseInt(code) ? 1234 : parseInt(code)
        if(!code) return res.status(404).json({message: 'params not found'}) 
        const checkCode = await visitorsModel.findOne({
            $or: [
              { inviteCode: code, esId:sec.esId, status:'invited' },
              { number: n2, esId:sec.esId, status:'invited' }
            ]
          }).populate({ path: 'invitedBy' })
        if(!checkCode) return res.status(404).json({message: 'code doesn\'t exist.'})

        if(checkCode.status === 'checkedout'){
            return res.status(401).json({message: 'This person has already been checked in and out'})
        }
        else if(checkCode.status === 'checkedin'){
            return res.status(401).json({message:`This person has already been checked in`})    
        }
        
        const file = files.files
        const filename = file.originalFilename
        const newFilename = file.newFilename
        try{
            fsPromises.rename(file.filepath, path.join(uploadsFolder, newFilename+filename))    
            
            checkCode.status = 'checkedin'
            checkCode.checkIn = new Date()
            checkCode.image = newFilename+filename
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

const ncheckin = async(req, res) => {
    try{
        const form =new Formidable.IncomingForm()
    const uploadsFolder = path.join(__dirname, '..', 'public')
    form.maxFileSize = 5 * 1024 * 1024
    form.uploadDir = uploadsFolder
    form.parse(req, async(err, fields, files)=>{
        const {name, pov, number, address} = fields
        const file = files.files
        const filename = file.originalFilename
        const newFilename = file.newFilename
       
        try{
            fsPromises.rename(file.filepath, path.join(uploadsFolder, newFilename+filename)) 
            const sec = await securityModel.findOne({_id: req.user })
            const vis = new visitorsModel({
                name:name,
                status: "checkedin",
                image: newFilename+filename,
                address:address,
                pov:pov,
                checkIn:new Date(),
                number,
                inviteCode: 'auto',
                esId: sec.esId
            })
            const v = await vis.save()
            return res.status(201).json(v)  
        }catch(err){
            console.log(err)
            return res.status(500).json({error:err.message})
            }
    })
    }catch(e){
        console.log(e)
        return res.status(500).json(e)
    } 
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
    const match = await bcrypt.compare(password, found.password)
    if(match){
        const accessToken = jwt.sign(
            {userr: found._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30m'}
        )
        return res.status(201).json({id:est.type, accessToken, role:2002})
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
        const mes = `From PROTECTPRO: \n  Dear Estate Chairman/Representative. This is your new guards login details: Guard 1: ${user}, Guard 2: ${secpassword}`
        found.password = sechashed
        found.user = user
        const chairman = await chairmenModel.findOne({esId: found.esId})
        const meb = await sendSMS(chairman.number, mes)
        console.log(mes)
        await found.save()
        return res.status(201).json({message:'sent'})
}

const verifyReAndDe = async(req, res) => {
    const id = req.user
    const security = await securityModel.findById(id)
    const {code} = req.query
    const dependant = await dependantsModel.findOne({accessToken: code}).populate({path: 'apartment'})
    const resd = await residentsModel.findOne({crat:code, esId: security.esId})
    if(!dependant && !resd) return res.sendStatus(404)
    if(dependant){
        const resident = await residentsModel.findById(dependant.resId)
        if(security.esId.toString() !== resident.esId.toString()) return res.sendStatus(403)
        return res.status(201).json(dependant)
    }
    return res.status(201).json({message: resd})
  }


module.exports = {LoginSec, verifyReAndDe, getSecurity, checkin, checkout, resetSecurityDetails, ncheckin}