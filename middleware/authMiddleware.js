import User from "../model/authModel.js";
import { verifyAuthToken } from "../utils/authUtils.js";

// This is the middleware function itself - your BOUNCER
const protect = async (req, res, next) => {
  let token;

  // 1. Check for the token in the headers (the bouncer looking for a wristband)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Format is: "Bearer <actual_token>"
    try {
      // Extract just the token from the string
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token (The bouncer checking if the wristband is real)
      const decoded = verifyAuthToken(token);

      // 3. Find the user from the token payload and attach them to the request object
      // This is crucial! The route handler now knows who made the request.
      // We select everything except the password (-password)
      req.user = await User.findById(decoded._id).select('-password');

      // 4. If all is good, call next() to let the request proceed to the route
      next();

    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
      return; // Always return after sending a response to stop execution
    }
  }

  // 5. If there's no token at all
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }
};

export { protect };