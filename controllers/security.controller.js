const securityModel = require("../models/security.model")
const bcrypt = require('bcrypt')
const visitorsModel = require("../models/visitors.model")

const getSecurity = async(req, res) => {
    const secId = req.session.secuser
    const sec = await securityModel.findOne({_id: secId }).lean().populate({path: 'expectedVisitors expectedToCheckout estate'})
    return res.json(sec)
}

const checkIn = async(req, res) => {
    const {code} = req.body 
    const checkCode = await visitorsModel.findOne({inviteCode: code}).exec()
    if(!checkCode) return res.status(404).json({message: 'code doesn\'t exist.'})
    if(checkCode.status === 'invited'){
        checkCode.status = 'checkedin'
        await checkCode.save()
        return res.json({message: 'This person has been checked in'})
    }else if(checkCode.status === 'checkedin'){
        return res.status(400).json({message:`This person has already been checked in`})    
    }
    else if(checkCode.status === 'checkedout'){
        return res.status(401).json({message:`This person has already been checked in and out`})    
    }
    return res.status(403).json({message: 'unknown error'})
}

const checkOut = async(req, res) => {
    const {code, name} = req.body
    if(!name || !code) return res.status(404).json({message: 'params not found  '}) 
    const checkCode = await visitorsModel.findOne({inviteCode: code}).exec()
    if(!checkCode) return res.status(404).json({message: 'code doesn\'t exist.'})
    if(checkCode.status === 'invited'){
        await checkCode.save()
        return res.status(401).json({message: 'This person has not been checked in'})
    }
    else if(checkCode.status === 'checkedout'){
        return res.status(401).json({message:`This person has already been checked in and out`})    
    }
    checkCode.status = 'checkedin'
    checkCode.name = name
    checkCode.checkOut = new Date()

    await checkCode.save()
    return res.status(201).json({message:`This person has already been checked out`})  
}

const LoginSec = async(req, res) => {
    const {user, password} = req.body 
    const found = await securityModel.findOne({user}).exec()
    if(!found) return res.status(404).json({message: "credentials not found"})
    const match = await bcrypt.compare(password, found.password)
    if(match){  
        req.session.regenerate(function (err) {
            if (err) console.log(err)
            req.session.secuser = found._id
            return req.session.save(function (err) {
                if (err) return console.log(err)
                return res.status(201).json({id: found._id})
              })
        })
    }
    else{
        return res.status(404).json({type:"wrongpass"})
    }
}

module.exports = {LoginSec, getSecurity, checkIn, checkOut}