const mongoose = require('mongoose')
const viSchema = new mongoose.Schema({
        name: {type:String, required:true},
        number:{type:Number, required:true},
        inId: {type: mongoose.Types.ObjectId},
        image: {type:String}
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})

viSchema.virtual('invitedBy', {
        ref:'residents',
        foreignField: '_id',
        localField: 'inId',
        justOne: true    
})


module.exports = mongoose.model('visitors', viSchema)