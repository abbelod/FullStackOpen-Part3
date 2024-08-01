const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url).then(result=>{
    console.log('Connected to MongoDB')
})
.catch(error=>{
    console.log('Error connecting to MongoDB:', error.message)
})


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        validate: {
            validator: function(v){
                return /^(\d{2}-\d+|\d{3}-\d+)$/.test(v);
            }
        },

        requred: true,
        minLength: 8
    }

})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)