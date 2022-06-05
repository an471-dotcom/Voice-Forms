const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const User = require('./models/user');
const { resourceLimits } = require('worker_threads');
const port = 3000
const uri = "mongodb+srv://user12:user123@cluster0.or7qu.mongodb.net/voiceForm";
const app = express()
app.use(bodyParser.json())
app.use(cors())
mongoose.connect(uri,err =>{
    if(err)
    console.log(err);
    else
    console.log('Db connected Successfully');
})

function verifyToken(req,res,next){
    if(!req.header.authorization){
        return res.send(401).send('Unauthorised Request')
    }
    let token = req.header.authorization.split('')[1];
    if(token == 'null'){
        return res.send(401).send('Unauthorised Request')
    }
    let payload =jwt.verify(token,'secret')
    if(!payload){
        return res.send(401).send('Unauthorised Request')
    }
    req.userId = payload.subject
    next()
}   

app.get('/',(req,res)=>{
    res.send('working')
})

app.post('/signup',async(req,res)=>{
    try{
        let userData = req.body;
        console.log(req.body);
        let user = new User(userData)
        let result = await user.save()
        let payload = {subject:result._id}
        let token = jwt.sign(payload,'secret')
        res.send({token})
        console.log(result);
    }catch(err){
        console.log(err);
    }
})
app.post('/login',async(req,res)=>{
    try{
        let userData = req.body;
        let result = await User.findOne({email:userData.email});
        if(!result){
            res.status(401).send("Invalid Email")
            return
        }else{
            if(result.password !== userData.password)
                res.status(401).send("Invalid Password")
            else{
                let payload = {subject:result._id}
                let token = jwt.sign(payload,'secret')
                res.status(200).send({token})
                console.log(result);
            }

        }
       
    }catch(err){
        console.log(err);
    }
})

app.post('/create/:id',async(req,res)=>{
    let user = await User.updateOne({_id:req.params.id},{$push:{forms:req.body}});
    console.log(user);
    res.send(user)

})

app.post('/update/:id/:formname',async(req,res)=>{
    console.log(req.body)
    let user = await User.updateOne({_id:req.params.id,"forms.heading":req.params.formname},{$set:{"forms.$.fields":req.body.fields,"forms.$.heading":req.body.heading}})
    res.send(user)
})

app.get('/user/:email',async(req,res)=>{
    let user = await User.findOne({email:req.params.email})
    res.send(user)
})

app.get('/delete/:id/:form',async(req,res)=>{
    let user = await User.updateOne({_id:req.params.id},{$pull:{forms:{heading:req.params.form}}})
    res.send(user)
})

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
})