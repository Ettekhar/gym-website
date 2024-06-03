const express = require('express')
const app = express()
require('dotenv').config();

const {getNotes,createNote,UpdateNote,DeleteNote} = require('./PreacticeDatabase.js')

app.use(express.json())

//Get notes
app.get('/notes', async(req,res) => {
    const notes = await getNotes();
    res.status(200).send(notes);
})

//Create Notes
app.post('/notes',async(req,res) => {
    const {title,contents} = req.body;
    const result = await createNote(title,contents);
    res.status(200).send(result);
})

//Update Notes
app.put('/notes', async(req,res) => {
    const {id,title,contents} = req.body;
    const result = await UpdateNote(id,title,contents);
    res.status(200).send(result);
})

//Delete Notes
app.delete('/notes/:id',async(req,res) => {
    const id = req.params.id
    const result = await DeleteNote(id);
    res.status(200).send(result);
})

app.use((err,req,res,next) => {
    console.log(err.stack);
    res.status(500).send('server error!!!');
})

app.all('*',(req,res) => {
    res.status(404).send('<h1>Page Not Found</h1>')
})

app.listen(process.env.PORT,(err) => {
    console.log("Server is listening at port: "+process.env.PORT);
})