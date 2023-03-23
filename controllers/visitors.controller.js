const Vi = require('../models/visitors.model')
const Re = require('../models/residents.model')
const randomizer = require('randomstring')
const sendSMS = require('../utils/sms')

const getAllVisitors = async(req, res) => {
    const esId = req.session.repid
    const {skip, limit} = req.params
    const resp = await Vi.find({esId: esId}).lean().skip(skip).limit(limit||10).populate({path:"invitedBy"})
    const count = await Vi.find({esId: esId}).lean().count()
    return res.json({resp, count})
}

const getAllExpectedVisitors = async(req, res) => {
    const {resId} = req.params 
    const resp = await Vi.find({resId, status: 'invited'}).lean()
    return res.json(resp)
}

const createNewVisitor = async(req, res) => {
    const resId = req.session.user
    const inviteCode = randomizer.generate({length:4, charset: 'hex',capitalization: 'uppercase'})+randomizer.generate({length:1,charset: 'alphabetic',capitalization: 'uppercase'})+randomizer.generate({length:1,charset: 'number',capitalization: 'uppercase'}) 
    const {number, name } = req.body
    const isUser = await Re.findOne({_id: resId})
    if(!isUser) res.status(403).json({message: 'Unauthorized'})
    const found = await Vi.findOne({number: number, status: 'invited', resId})
    const mes1 = `Hello, your invite code to visit Mr/Mrs is ${inviteCode}`
    const mes2 = `[invite resent] Hello, your invite code to visit Mr/Mrs is ${found ? found.inviteCode: inviteCode}`
    
    if(!found){
        const gen = new Vi({number, name, esId: isUser.esId, resId, inviteCode })
        await gen.save()
        const resp = await sendSMS(number, mes1)
        if(resp.status !== 1) return res.status(400).json({resp})
        return res.json({message: "invite sent"})
    }
    const resp = await sendSMS(number, mes2)
    return res.json({message: "invite sent"})

}

module.exports = {getAllVisitors, createNewVisitor, getAllExpectedVisitors}