const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const checkAuth= require('../middleware/check-auth');

const User=require('../models/user');

router.get('/', checkAuth,(req,res,next)=>{
    User.find()
    .exec()
    .then(docs=>{
        // console.log(docs);
        res.status(200).json({
            count: docs.length,
            users: docs.map(doc=>doc)
        });
    }
    ).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});
router.post('/login',(req,res,next)=>{
    User.findOne({username:req.body.username})
    .exec()
    .then(user=>{
        if (!user){
            return res.status(401).json({
                message:'Auth failed'
            })
        }
        else{
            bcrypt.compare(req.body.password,user.password,(err,result)=>{
                if (err) {
                    return res.status(401).json({
                        message:'Auth failed'
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                        username: user.username,
                        userId: user._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                    )
                    return res.status(200).json({
                        message:'Auth successful',
                        token: token
                    })
                }
                return res.status(401).json({
                    message:'Auth failed'
                })
            })  
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        }) 
    })
});
router.post('/signup',(req,res,next)=>{
    User.find({username:req.body.username})
    .exec()
    .then(user=>{
        if (user.length) {
            return res.status(409).json({
                message:'User exists',
                user: user
            })
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if (err){
                return res.status(500).json({
                error:err
                })
            }
            else{
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    username: req.body.username,
                    password: hash
                });
                console.log(user);
                user
                .save()
                .then(result=>{
                    // console.log(result);
                    res.status(201).json({
                    message:'User created',
                }); 
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({
                        here: 'here',
                        error:err
                    })
                })
            }
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
router.delete('/:userId', checkAuth,(req,res,next)=>{
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
});

module.exports = router;