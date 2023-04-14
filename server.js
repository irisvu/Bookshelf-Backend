//Importing libraries
import express from 'express';
import mongoose from 'mongoose';

//app config
const app  = express()
const port = process.env.PORT || 9000

const connection_url = "mongodb+srv://webapi:finalproject@cluster0.brqgtzh.mongodb.net/?retryWrites=true&w=majority"

//middleware

//DB config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

//API endpoints
app.get("/", (req, res) => res.status(200).send("Hello World!"))

//Listener
app.listen(port, () => console.log(`listening on localhost:${port}`))