// UserModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  // --- ADDED: first_name, last_name, and shipping_address fields with validation ---
  first_name: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[A-Z][a-zA-Z]*$/.test(v);
      },
      message: 'First name must start with a capital letter and contain no spaces, numbers, or special characters.'
    }
  },
  last_name: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[A-Z][a-zA-Z]*$/.test(v);
      },
      message: 'Last name must start with a capital letter and contain no spaces, numbers, or special characters.'
    }
  },
  shipping_address: {
    type: String,
    required: true
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
  },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  }
}, { timestamps: true });

// --- MODIFIED: Update static signup method to accept and use the new fields ---
userSchema.statics.signup = async function(email, password, username, phone_number, role_id, first_name, last_name, shipping_address) {

  // validation
  if (!email || !password || !username || !phone_number || !role_id || !first_name || !last_name || !shipping_address) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    throw Error('Username must contain only letters and numbers');
  }
  if (!/^[0-9]{8}$/.test(phone_number)) {
    throw Error('Phone number must be 8 digits');
  }
  // The schema will handle name validation, but we can check here for early exit if needed.

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    first_name,
    last_name,
    shipping_address,
    email, 
    password: hash,
    username,
    phone_number,
    role_id
  });

  return user;
};

// static login method (unchanged)
userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }
  const match = user.password.startsWith('$2b$') ? await bcrypt.compare(password, user.password) : user.password === password;
  if (!match) {
    throw Error('Incorrect password');
  }
  return user;
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);