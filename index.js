const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 3000


//middleware

app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {
    res.send('Welcome to the Asians sever')
})

app.listen(port, () =>{
    console.log('connected');
})