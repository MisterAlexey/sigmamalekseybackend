var express = require('express')
var app = express()
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var bodyParser = require('body-parser')
const url = "mongodb://test:q2w3e4r5@ds151626.mlab.com:51626/heroku_bhddf929"

app.use(function(reg, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origins, X-Requesterd-With, Counter-Type, Accept");
    next();
})

app.use(bodyParser.json());

app.post('/reg', (reg, res)=>{
    MongoClient.connect(url, (err, db)=>{
        if (err) throw err;
        var dbo = db.db("heroku_bhddf929")
        dbo.collection("users").findOne({login: reg.body.login}, (err, check) =>{
            if (err) throw err;
            if(!check){
                dbo.collection("users").insertOne(reg.body, (err, result) =>{
                    if (err) throw err;
                    if(result){
                        res.json({type: "ok"})
                        db.close()
                    }else{
                        res.json({type: "err"})
                        db.close()
                    }
                })
            }else{
                res.json({type: "just_used"})
                db.close()
            }
        })
    })
})
app.post('/pay', (reg, res)=>{
    if(ObjectID.isValid(reg.body._id)){
        MongoClient.connect(url, (err, db)=>{
            if (err) throw err;
            var dbo = db.db("heroku_bhddf929") 
            dbo.collection("users").updateOne({_id: ObjectID(req.body._id)}, {$set: {payment: true}}, (err, result)=>{
                if(err) throw err;
                if(result){
                    res.json({type:'ok'})
                    db.close()
                }else{
                    res.json({type: "err"})
                    db.close()
                }
            })
        })
    }else{
        res.json({type: "invalid_id"})
    }
})

app.post('/get_girl', (req, res)=>{
    if(ObjectID.isValid(req.body._id)){
        MongoClient.connect(url, (err, db)=>{
            if (err) throw err;
            var dbo = db.db("heroku_bhddf929") 
            dbo.collection("users").findOne({_id: ObjectID(req.body._id)}, (err, result)=>{
                if(err) throw err;
                if(result){
                    dbo.collection("users").updateOne({_id: ObjectID(req.body._id)}, {$set: {views: result.views+1}}, (err, n)=>{
                    if(err) throw err;
                    var user = result;
                    user.views++;
                    res.json({type: 'ok', user: user})
                    db.close()
                    })
                }else{
                    res.json({type: "err"})
                    db.close()
                }
            })
        })
    }else{
        res.json({type: "invalid_id"})
    }
})

app.get('/users', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbo = db.db("heroku_bhddf929")
        dbo.collection("users").find({}, { projection: { password: 0 } }).toArray((err, result) => {
            if(err) throw err;
            res.json(result)
            db.close()
        })
    })
})

app.post('/edit', (req, res)=>{
    if(ObjectID.isValid(req.body._id)){
        MongoClient.connect(url, (err, db)=>{
            if (err) throw err;
            var dbo = db.db("heroku_bhddf929") 
            dbo.collection("users").findOne({_id: ObjectID(req.body._id)}, (err, result)=>{
                if(err) throw err;
                if(result){
                    dbo.collection("users").updateOne({_id: ObjectID(req.body._id)}, {$set: {
                        "phone_number": 89131092,
                        "age": 81,
                        "price_hour": 1400,
                        "price_night": 10000,
                        "services": [
                            "first",
                            "second",
                            "third",
                            "hard"
                        ]
                    }}, (err, edited_data)=>{
                    if(err) throw err;
                    var user = result;
                    res.json({type: 'ok', user: user})
                    db.close()
                    })
                }else{
                    res.json({type: "err"})
                    db.close()
                }
            })
        })
    }else{
        res.json({type: "invalid_id"})
    }
})

app.listen(3000, ()=>{
    MongoClient.connect(url, (err, db)=>{
        if (err) throw err;
        console.log("Connection to datababe is successiful")
    })
})
