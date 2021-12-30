//CRUD
// const mongodb = require('mongodb')
//connection
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId

//destructuring 
const {MongoClient, ObjectID} =  require('mongodb')


//url required to make connection
const connectionurl = 'mongodb://127.0.0.1:27017'
const databasename = 'task-manager'

// const id = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionurl, {useNewUrlParser : true}, (error, client) => {
    if(error) {
        return console.log('Unable to connect Database')
    }
    // console.log('Connected Successfully')
    const db = client.db(databasename)
    
    // //inserting collection
    // db.collection('users').insertOne({
    //     _id : id,
    //     name : 'gwen',
    //     age : 22
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('users').insertMany([
    //     {
    //         name : 'Jen',
    //         age : 15
    //     },
    //     {
    //         name : 'Ben',
    //         age : 20
    //     }
    // ], (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert documents')
    //     }
    //     console.log(result.insertedIds)
    // })
    // db.collection('Tasks').insertMany([
    //     {
    //         description : 'Cleaning',
    //         completed : false
    //     },
    //     {
    //         description : 'reading',
    //         completed : true
    //     },
    //     {
    //         description : 'work',
    //         completed : false
    //     }  
    // ], (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert Tasks')
    //     }
    //     console.log(result)
    // })

    //Read
    // db.collection('users').findOne({ _id : new ObjectID("61a6f6ccff0cd12868e2291d")}, (error, user) => {
    //     if(error) {
    //         console.log('User Not Found')
    //     }
    //     console.log(user)
    // })

    // db.collection('users').find({ age : 22 }).toArray((error, users) => {
    //     console.log(users)
    // })
    // db.collection('users').find({ age : 22 }).count((error, count) => {
    //     console.log(count)
    // })

    // db.collection('Tasks').findOne({ _id : new ObjectID("61a6f832de456350049e7ca9")}, (error, task) => {
    //     if(error) {
    //         console.log('Unable to Find Task')
    //     }
    //     console.log(task)
    // })

    // db.collection('Tasks').find({ completed : false }).toArray((error, tasks) => {
    //     console.log(tasks)
    // })

    //Updating
    // db.collection('users').updateOne({
    //     _id : new ObjectID("61a6edf5fea3aaac40a59e2c")
    // }, {
    //     $set : {
    //         name : 'Mike'
    //     }
    // }).then((result)=> {
    //     console.log(result)
    // }).catch((error)=> {
    //     console.log(error)
    // })
    // db.collection('users').updateOne({
    //     _id : new ObjectID("61a6edf5fea3aaac40a59e2c")
    // }, {
    //     $inc : {
    //         age : 1
    //     }
    // }).then((result)=> {
    //     console.log(result)
    // }).catch((error)=> {
    //     console.log(error)
    // })

    // db.collection('Tasks').updateMany({
    //     completed : false
    // }, {
    //     $set : {
    //         completed : true
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // Deleting

    // db.collection('users').deleteMany({
    //     age : 20
    // }).then((result)=> {
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('Tasks').deleteOne({
        description :'work'
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
})