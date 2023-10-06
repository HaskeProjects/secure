const mongoose = require('mongoose')
const deSchema = new mongoose.Schema({
        firstname: {type:String, required:true},
        lastname: {type:String, required:true}, 
        resId: {type: mongoose.Types.ObjectId, required: true},
        accessToken: {type:String, required: true},
        number: {type:Number, required: false}
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})

deSchema.virtual('apartment', {
    ref: 'residents', // The name of the model you want to populate from
    localField: 'resId', // The field in the current model
    foreignField: '_id', // The field in the referenced model
    justOne: true, // Set to true if you want a single result, false for an array
    options: { select: 'apartment' }, // You can specify which fields to select from the referenced model
  });


module.exports = mongoose.model('dependants', deSchema)