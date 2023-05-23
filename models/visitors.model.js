const mongoose = require('mongoose')
const viSchema = new mongoose.Schema({
        name: {type:String, default:null},
        number:{type:Number, required:true},
        status:{type:String, default: "invited"},
        inviteCode: {type:String, required: true},
        address: {type:String, default:null},
        pov:{type:String, default:null},
        checkOut:{type:String, default: "0"},
        checkIn:{type:String, default: "0"},
        resId: {type: mongoose.Types.ObjectId},
        esId: {type: mongoose.Types.ObjectId},
        image: {type:String, default:'un'} 
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
 })

viSchema.virtual('invitedBy', {
        ref:'residents',
        foreignField: '_id',
        localField: 'resId',
        justOne: true    
})


module.exports = mongoose.model('visitors', viSchema)
