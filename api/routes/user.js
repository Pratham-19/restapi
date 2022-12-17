const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const User=require('../models/user');

router.post('/signup',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if (user.length) {
            return res.status(409).json({
                message:'User exists'
            })
        }
        else{
            const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            linkedinUrl: req.body.linkedinUrl
            });
            // console.log(user);
            user
            .save()
            .then(result=>{
                console.log(result);
                res.status(201).json({
                message:'User created',
            }); 
            })
            .catch(err=>{
                    console.log(err);
                    res.status(500).json({
                        error:err
                    })
            })
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });

});
router.delete('/:userId',(req,res,next)=>{
    User.remove({_id:req.params.userId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'User deleted'
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
})

module.exports = router;