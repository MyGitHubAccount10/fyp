const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  role_id: {
    type: Number,
    default: 4001
  },
  username: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9]+$/.test(v);
      },
      message: props => `${props.value} is not a valid username!`
    }
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Invalid email']
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return !/\s/.test(v);
      },
      message: 'Password cannot contain spaces'
    }
  },
  phone_number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{8}$/.test(v);
      },
      message: 'Phone number must be 8 digits'
    }
  }
}, { timestamps: true })

// static signup method
userSchema.statics.signup = async function(email, password, username, phone_number) {

  // validation
  if (!email || !password || !username || !phone_number) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    throw Error('Username must contain only letters and numbers')
  }
  if (!/^[0-9]{8}$/.test(phone_number)) {
    throw Error('Phone number must be 8 digits')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ 
    email, 
    password: hash,
    username,
    phone_number
  })

  return user
}

// static login method
userSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = user.password.startsWith('$2b$') ? await bcrypt.compare(password, user.password) : user.password === password;
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
