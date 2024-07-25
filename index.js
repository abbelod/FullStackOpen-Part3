const express = require('express')
const app = express()
var morgan = require('morgan')

morgan.token('content', function getContent(req){
    return JSON.stringify(req.body)
})

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
  response.json(persons)
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

    const person = persons.find(person => person.id === request.params.id)

    if(person){
        persons = persons.filter(person=> person.id != request.params.id)
        response.status(204).end()
    }
    else{
        response.status(404).end()
    }

})


app.post('/api/persons', (request,response)=>{


   const person = request.body


   if(!person.name || !person.number){
    console.log('Request must have a name and a number')
    response.status(400).json({
        error:"name and number missing"
    })
   }
   
   if(persons.find(Operson=> Operson.name === person.name)){
    return response.status(500).json({
        error: "Name already exists in Phonebook"
    })
   }


       person.id =Math.floor(Math.random()*1000)
    
       console.log(person)
    
       persons = persons.concat(person)
       response.json(person)
}
)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})