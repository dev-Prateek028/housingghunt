import mongoose from 'mongoose';

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    // Username field
    username: {
      type: String, // The type is String
      required: true, // This field is required
      unique: true, // This field must be unique
    },
    // Email field
    email: {
      type: String, // The type is String
      required: true, // This field is required
      unique: true, // This field must be unique
    },
    // Password field
    password: {
      type: String, // The type is String
      required: true, // This field is required
    },
    // Avatar field
    avatar: {
      type: String, // The type is String
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" // Default value if none is provided
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model to use it in other parts of the application
export default User;
