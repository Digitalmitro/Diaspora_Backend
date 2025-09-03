import AuthService from "../services/authServices.js";

class AuthController {
  async signup(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const result = await AuthService.signup({ name, email, password, role });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

export default new AuthController();
