const express=require('express');
const router=express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'Handling GET requests to /test'
    });
});

router.post('/',(req,res,next)=>{
    const order ={
        name: req.body.name,
        price: req.body.price
    }
    res.status(200).json({
        message:'Handling POST requests to /test',
        order: order
    });
});

module.exports=router;