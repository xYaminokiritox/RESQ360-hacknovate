import mongoose, { Document } from 'mongoose';

// Define the user interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  token?: string;
  contactNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema<IUser>(
  {
    // Define the name field with type String, required, and trimmed
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Define the email field with type String, required, and trimmed
    email: {
      type: String,
      required: true,
      trim: true,
    },
    // Define the password field with type String and required
    password: {
      type: String,
      required: true,
    },
    // Define the token field for JWT
    token: {
      type: String,
    },
    // Define the contact number field
    contactNumber: {
      type: String,
    }
  },
  { timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "user"
export default mongoose.model<IUser>("user", userSchema); 