const express = require('express')
require('dotenv').config()

const Person = require('./models/person')
const app = express()
const cors = require('cors')
var morgan = require('morgan')


morgan.token('content', function getContent(req){
    return JSON.stringify(req.body)
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
  }
  next(error)
}


app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time :content'))



let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/info', (request, response) => {

    console.log(request.headers)
    let date = new Date(); 
    const toSend = `<p>Phonebook has info for ${persons.length} people </p>
    <p>${date} </p>`
  response.send(toSend)
})

app.get('/api/persons', (request, response) => {
  // response.json(persons)
  Person.find({}).then(person=>{
    response.json(person)
  })
})


app.get('/api/persons/:id', (request,response)=>{

    const person = (persons.find(person=> person.id === request.params.id))

    console.log(person)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request,response)=>{

  Person.findByIdAndDelete(request.params.id)
  .then(result=> {
    response.status(204).end()
  })
  .catch(error=>next(error))

})


app.post('/api/persons', (request,response)=>{

   const body = request.body


   if(!body.name || !body.number){
    console.log('Request must have a name and a number')
    response.status(400).json({
        error:"name and number missing"
    })
   }
   
   if(persons.find(Operson=> Operson.name === body.name)){
    return response.status(500).json({
        error: "Name already exists in Phonebook"
    })
   }

   const person = new Person({
    name: body.name,
    number: body.number,
   })
    

   person.save().then(savedPerson=>{
    response.json(savedPerson)
   })
    
}
)

app.put('/api/persons/:id', (request,response,next) => {
  const body = request.body

  const person =  {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new:true})
  .then(updatedPerson=>{
    response.json(updatedPerson)
  })
  .catch(error=>next(error))
})



app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})