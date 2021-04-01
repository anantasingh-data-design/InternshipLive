const express = require('express');
const app = express(); //here make object
const port= 8500;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
//const mongourl="mongodb://localhost:27017";
const mongourl="mongodb+srv://anantkumarsingh:databaseconnection@cluster0.yz58x.mongodb.net/myData?retryWrites=true&w=majority";
let db;

const cors = require('cors');
const bodyParser = require('body-parser');
//Middleware
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//first and deault rout ("/" means default )
app.get('/',function(req,res){
    res.send('hi! greetings from Modi ')
})

//second rout create
app.get('/location',(req,res)=>{
    db.collection('location').find().toArray((err,result)=>{
    res.send(result)
    })
})
// these are how to get rout


//restaurant details
app.get('/rest/:id',(req,res)=>{
    let {id}=req.params;
    db.collection('restaurant').find({_id:id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurant',(req,res)=>{
    //console.log(req.query.city)
    var condition={};
    let sortcondition = {cost:1}
    if(req.query.sort){
        sortcondition = {cost:Number(req.query.sort)}
    }
    if(req.query.city && req.query.mealtype){
        condition={$and:[{"type.mealtype":req.query.mealtype},{city:req.query.city}]}
    }
    if(req.query.cuisine && req.query.mealtype){
        condition={$and:[{"type.mealtype":req.query.mealtype},{"cuisine.cuisine":req.query.cuisine}]}
    }

    else if(req.query.city){
        condition={city:req.query.city}
    }
    else if(req.query.mealtype){
        condition={"type.mealtype":req.query.mealtype}
    }
    else if(req.query.cuisine){
        condition={"Cuisine.cuisine":req.query.cuisine}

    }
    else if(req.query.lcost && req.query.hcost){
        condition = {$and:[{cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}]}
    }

    db.collection('restaurant').find(condition).sort(sortcondition).toArray((err,result)=>{
        res.send(result)
    })
})

app.get('/orders',(req,res)=>{
    db.collection('booking').find().toArray((err,result)=>{
        res.send(result)
    })
})
//place order

app.post('/placeOrder',(req,res)=>{
    db.collection('booking').insert(req.body,(err,result)=>{
        if(err) throw err;
        res.send('data added')
    })
})

app.get('/mealtype',(req,res)=>{
    db.collection('mealtype').find().toArray((err,result)=>{
        res.send(result)
    })
})

app.get('/cuisine',(req,res)=>{
    db.collection('cuisine').find().toArray((err,result)=>{
        res.send(result)
    })
})
//connect with database
MongoClient.connect(mongourl,(err,connection)=>
{
    if (err) console.log(err);
    db=connection.db('edureka_internship')
})

// we make an aplication to listen to port number 
app.listen(port,function(err){
    if(err) throw err;
    console.log(`server is running on  port ${port}`)
}) //this is how to start getting a server with express 