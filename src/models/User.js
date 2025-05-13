// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, //  Asegurate de hashearla en producción
});

export default mongoose.models.User || mongoose.model("User", UserSchema, "usuarios");