import mongoose from 'mongoose';
import * as argon2 from 'argon2';

const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: { type: Number, required: true, min: 1 }
});

const UserSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: function (value) {
                return value.includes('@');
            }
        }},
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },
    cart: {
        type: [CartItemSchema],
        default: []
    }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await argon2.hash(this.password);
  next();
});

UserSchema.methods.correctPassword = async function (
  userPassword,
  candidatePassword
) {
  return await argon2.verify(userPassword, candidatePassword);
};

export const User = mongoose.model('User', UserSchema, 'users');