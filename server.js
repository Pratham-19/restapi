const express=require('express');
const app=express();
const logger = require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
require('dotenv').config()
const port = process.env.PORT || 3000; 
const users= require('./api/routes/user');
const contact= require('./api/routes/contact');

//connecting  mongodb
mongoose.connect(`mongodb+srv://root:${process.env.MONGO_ATLAS_PW}@cluster0.0p8fx6r.mongodb.net/?retryWrites=true&w=majority`,{useNewUrlParser:true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB!');
});

app.use("/uploads", express.static('uploads'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/users',users);
app.use('/contact',contact);


app.listen(port,() => {
    console.log(`Server started at port ${port}`);
})
app.use((req,res,next)=>{
    const error=new Error('Not Found');
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})