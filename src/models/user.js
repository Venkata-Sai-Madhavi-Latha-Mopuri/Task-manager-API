const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./task')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        lowercase :true,
        unique :true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is Invalid')
            }
        }        
    },
    age : {
        type : Number,
        default : 0,
        validate(value) {
            if(value < 0){
                throw new Error('Age must be Positive number')
            }
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    },
    password : {
        type : String,
        required : true,
        trim : true,
        validate(value) {
            if(value.length <= 6) {
                throw new Error('Password must be greater than 6 Letters')
            }
            if(value.toLowerCase().includes("password")) {
                throw new Error ('Password must not be password')
            }
        }
    }
}, {
    timestamps : true
})

userSchema.virtual('tasks', {
    ref : 'Tasks',
    localField : '_id',
    foreignField : 'owner'
})
userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user =await User.findOne({ email })

    if(!user) {
        throw new Error('Unable to Login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(isMatch === false) {
        throw new Error ('Unable to Login')
    }

    return user
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//Hash the plain password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    //If the next() is not called, it will never save as it thinks we might running some other operation
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Tasks.deleteMany({owner : user._id})
    next()
})
const User = mongoose.model('User',userSchema)

module.exports = User
