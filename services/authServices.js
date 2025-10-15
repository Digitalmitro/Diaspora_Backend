import User from "../model/authModel.js";
import { hashPassword, comparePassword, generateAuthToken } from "../utils/authUtils.js";

class AuthService {
  async signup({ name, email, password, role }) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    const token = generateAuthToken(newUser);
    return {
      message: "User created successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateAuthToken(user);

    return { message: "User logged in successfully", token, user };
  }
}

export default new AuthService();
