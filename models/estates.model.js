const mongoose = require('mongoose')
const Chair = require('./chairmen.model')
const Residents =  require('./residents.model')
const Visitors = require('./visitors.model')
const esSchema = new mongoose.Schema({
        name: {type:String},
        location: {type:String},
        type:{type:String},
        end: {type:String},
        start: {type:String}
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})

esSchema.virtual('chairman',{
        ref:'chairmens',
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

esSchema.virtual('totalSignin',{
        ref:'visitors',
        foreignField: 'esId',
        localField: '_id',
        match:{status: 'checkedin'},
        count: true
})
esSchema.virtual('totalExpected',{
        ref:'visitors',
        foreignField: 'esId',
        localField: '_id',
        match:{status: 'invited'},
        count: true
})
esSchema.virtual('re',{
        ref:'residents',
        foreignField: 'esId',
        localField: '_id'
})


esSchema.pre('remove',async function(next){
        const esId = this._id
        await Chair.deleteOne({esId: esId})
        await Residents.deleteMany({esId: esId})
        await Visitors.deleteMany({esId: esId})
        next()
})

module.exports = mongoose.model('estates', esSchema) 