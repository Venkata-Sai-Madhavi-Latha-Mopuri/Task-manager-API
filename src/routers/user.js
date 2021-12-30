const express = require('express')
const { default: isEmail } = require('validator/lib/isemail')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter (req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please uplaod a valid Image'))
        }
        cb(undefined, true)

    }
})


router.post('/users/me/avatar',auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).png().resize({ width : 250, height : 250}).toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()

}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar',auth, async(req, res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
})

router.get('/users/me/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e){
        res.status(404).send()
    }
})

router.post('/users', async (req,res)=>{
    // console.log(req.body)
    const user = new User(req.body)
    
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
    
})


router.post('/users/login', async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }catch(e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            // console.log(token)
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
    
})


router.post('/users/logoutAll', auth, async(req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async(req,res) => {

    res.send(req.user)
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send()
    // })

    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch (e) {
    //     res.status(500).send(e)
    // }
})



router.patch('/users/me', auth, async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOpertion = updates.every((updat) => allowedUpdates.includes(updat))
    if( isValidOpertion === false) {
        return res.status(400).send('Error! : Invalid Operation')
    }
    try {
        // const user = await User.findByIdAndUpdate(req.params.id,req.body, { new : true, runValidators : true})

        // const user = await User.findById(req.params.id)
        
        updates.forEach((updat) => req.user[updat] = req.body[updat])

        await req.user.save()
        // if(!req.user) {
        //     return res.status(404).send()
        // } 
        res.send(req.user)
    }catch (e) {
        res.status(400).send()
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        res.send(req.user)
    }catch(e) {
        res.status(500).send()
    }
})





module.exports = router