//Importing libraries
import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import dotenv from 'dotenv';
import Cors from 'cors';
import Posts from './postModel.js';

//    * * * * * * * * * * * app config * * * * * * * * * * *    //
const app  = express()
const port = process.env.PORT || 9000

//Pusher Configuration

const pusher = new Pusher({
  appId: process.env.pusherID,
  key: process.env.pusherKey,
  secret: process.env.pusherSecret,
  cluster: "us3",
  useTLS: true
});

/*pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});*/

//    * * * * * * * * * * * middleware * * * * * * * * * * *    //
app.use(express.json())
app.use(Cors())
dotenv.config()

//connecting to DB
mongoose.connect(process.env.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//connecting the database to pusher
mongoose.connection.once('open', () => {
    console.log('DB connected');
    const changeStream = mongoose.connection.collection('posts').watch();
    changeStream.on('change', (change) => {
        console.log(change);
        if(change.operationType === 'insert'){
            console.log('Triggering Pusher');
            pusher.trigger('posts', 'inserted', {
                change: change
            });
        } else {
            console.log('Error triggering Pusher');
        }
    })
})

app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
})


//    * * * * * * * * * * * API Endpoints * * * * * * * * * * *    //
app.get("/", (req, res) => res.status(200).send("Hello World!"))

//upload request
app.post("/upload", (req, res) => {
    const dbPost = req.body
    Posts.create(dbPost).then(function(err, data) {
        if(err)
            res.status(500).send(err)
        else
            res.status(201).send(data)
    });
})

app.get("/sync", (req, res) => {
    Posts.find().then(function(err, data) {
        if(err)
            res.status(500).send(err)
        else
            res.status(200).send(data)
    });
})

//Listener
app.listen(port, () => console.log(`listening on localhost:${port}`))
