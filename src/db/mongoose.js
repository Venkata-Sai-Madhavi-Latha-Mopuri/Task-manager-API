const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser : true
    // useCreateIndex : true
})


// const me = new User({
//     name : '   Prerna          ',
//     email : 'Prerna@gmail.com         ',
//     age : 25,
//     password : "Phn@123"
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!!',error)
// })


// const task = new Tasks( {
//     description : 'Learning',
//     // completed : true
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log('Error !!', error)
// })