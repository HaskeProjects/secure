const mongoose = require('mongoose')
const Chair = require('./chairmen.model')
const Residents =  require('./residents.model')
const Visitors = require('./visitors.model')
const esSchema = new mongoose.Schema({
        name: {type:String, required:true},
        location: {type:String, require:true}
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})

esSchema.virtual('chairman',{
        ref:'chairmans',
        foreignField: 'esId',
        localField: '_id',
        justOne: true
})

esSchema.virtual('residentCount',{
        ref:'residents',
        foreignField: 'esId',
        localField: '_id',
        count: true
})

esSchema.virtual('totalVisits',{
        ref:'visitors',
        foreignField: 'esId',
        localField: '_id',
        count: true
})


esSchema.pre('remove',async function(next){
        const esId = this._id
        await Chair.deleteOne({esId: esId})
        await Residents.deleteMany({esId: esId})
        await Visitors.deleteMany({esId: esId})
        next()
})

module.exports = mongoose.model('estates', esSchema)