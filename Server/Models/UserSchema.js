const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        id: {type:String, unique:true},
        name: { type: String, required: true },          // User's full name
        email: { type: String, required: true, unique: true },  // User's email (unique)
        password: { type: String, required: true },      // User's password
        birthDate: { type: Date, required: true },       // User's birth date
        gender: { type: String, required: true },        // User's gender
        isAdmin: { type: Boolean, default: false },      // Whether the user is an admin or not
        avatar: { type: String, default: "" },           // Avatar URL (can be used for custom images)
    },
    { collection: "user", versionKey: false }
);

module.exports = mongoose.model('user', UserSchema);
