import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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
    },
    role: {
      type: String,
      enum: ['employee', 'hr'],
      default: 'employee',
      required: true,
    },
    cart: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: { type: Number, required: true, min: 1 }
    }]
});

export const User = mongoose.model('User', UserSchema, 'users');