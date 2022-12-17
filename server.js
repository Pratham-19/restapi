const express=require('express');
const app=express();
const logger = require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
require('dotenv').config()
const port = process.env.PORT || 3000; 
const test=require('./api/routes/test');
const user=require('./api/routes/user');

try{
	mongoose.connect('mongodb://localhost:27017/users')
	console.log('connected to db')
}
catch(err){
	console.log(err)
}
// const user=require('./api/routes/user');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/test',test);
app.use('/user',user);
// app.use(express.json());
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