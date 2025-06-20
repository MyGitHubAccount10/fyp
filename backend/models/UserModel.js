// UserModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator'); // ✅ FIX: Changed from a string to a require statement

const Schema = mongoose.Schema;

const userSchema = new Schema({
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  full_name: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]*$/.test(v);
      },
      message: 'Full name must only contain letters and spaces.'
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
    validate: [validator.isEmail, 'Invalid email'] // This will now work correctly
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

// Static signup method (now works correctly with the validator package)
userSchema.statics.signup = async function(email, password, username, phone_number, role_id, full_name, shipping_address) {
  if (!email || !password || !username || !phone_number || !role_id || !full_name || !shipping_address) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    full_name,
    shipping_address,
    email, 
    password: hash,
    username,
    phone_number,
    role_id
  });

  return user;
};

// Static login method (unchanged)
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