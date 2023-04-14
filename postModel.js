//Importing modules
import mongoose from 'mongoose'


//Creating the post Schema
const postsModel = mongoose.Schema({
    caption: String,
    user: String,
    image: String
})
