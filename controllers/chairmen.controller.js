const Chair = require('../models/chairmen.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {body} = require('express-validator')

const getAllChair = (req, res) => {
    return res.status(201).json({message: 'authorized'})
}


const ChairmanLogin = async(req, res) => {

    const {user, password} = req.body
    if(![user, password].every(Boolean)) return res.status(404).json({type:"incompleteinfo", message: 'user login credentials required'})
    const numregex = /^[0-9]{9,10}$/
    const tester = numregex.test(parseInt(user)) ? {number: user} : body(user).isEmail() ? {email: user} :  {number: 000}
    const found = await Chair.findOne(tester).exec()
    
    if(!found) return res.status(404).json({message: "not found"})

    const match = await bcrypt.compare(password, found.password)
    if(match){  
        const accessToken = jwt.sign(
            {userr: found.esId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30m'}
        )
        
        return res.status(201).json({id:found.esId, accessToken, role:2001})
    }
    else{
        return res.status(404).json({type:"wrongpass"})
    }
}

const changeChair = async(req, res) => {
    const {newChairName, newChairNumber, chId} = req.body 
    if (!chId) return res.status(403)
    const found = await Chair.findOne({_id: chId}).exec()
    found.name = newChairName
    found.number = newChairNumber
    const resp = await found.save()
    return res.json(resp)
}

module.exports = {getAllChair, ChairmanLogin, changeChair}