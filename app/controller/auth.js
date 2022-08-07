import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../model/UserModel.js";
import { formatValidationMessage } from "../utils/formatValidationMessage.js";

export const registerHandler = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Register user'
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: 'true',
        type: 'object',
        schema: { $ref: '#/definitions/Credentials' }
} */
  /* #swagger.responses[201] = {
        description: 'Created user',
        schema: { $ref: '#/definitions/Success' }
} */
  /* #swagger.responses[400] = {
        description: 'Invalid email',
        schema: { $ref: '#/definitions/InvalidEmail' }
} */
  /* #swagger.responses[400] = {
        description: 'Invalid password',
        schema: { $ref: '#/definitions/InvalidPassword' }
} */
  /* #swagger.responses[400] = {
        description: 'Already email used',
        schema: { $ref: '#/definitions/EmailAlready' }
} */
  /* #swagger.responses[500] = {
        description: 'Some error',
        schema: { $ref: '#/definitions/FailedRegister' }
} */
  try {
    const errors = validationResult(req).formatWith(formatValidationMessage);

    if (!errors.isEmpty()) {
      return res.status(400).json({ ok: false, ...errors.mapped() });
    }

    const userEmail = req.body.email;
    const userExist = await UserModel.exists({ email: userEmail });

    if (userExist) {
      return res.status(400).json({ ok: false, message: "User with such an email already exists" });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const model = new UserModel({
      email: userEmail,
      password_hash: passwordHash,
    });

    const user = await model.save();

    res.status(201).json({ ok: true });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ ok: false, message: "Failed to register. Try again" });
  }
};

export const loginHandler = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Log in user'
  /* #swagger.parameters['body'] = {
        in: 'body',
        required: 'true',
        type: 'object',
        schema: { $ref: '#/definitions/Credentials' }
} */
  /* #swagger.responses[201] = {
        description: 'Login success',
        schema: { $ref: '#/definitions/SuccessLogin' }
} */
  /* #swagger.responses[400] = {
        description: 'Invalid email',
        schema: { $ref: '#/definitions/InvalidEmail' }
} */
  /* #swagger.responses[400] = {
        description: 'Invalid password',
        schema: { $ref: '#/definitions/InvalidPassword' }
} */
  /* #swagger.responses[400] = {
        description: 'Incorrect user data',
        schema: { $ref: '#/definitions/IncorrectCredentials' }
} */
  /* #swagger.responses[500] = {
        description: 'Some error',
        schema: { $ref: '#/definitions/FailedLogin' }
} */
  try {
    const errors = validationResult(req).formatWith(formatValidationMessage);

    if (!errors.isEmpty()) {
      return res.status(400).json({ ok: false, ...errors.mapped() });
    }

    const userEmail = req.body.email;
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) return res.status(400).json({ ok: false, message: "Incorrect email or password" });

    const isValidPassword = await bcrypt.compare(req.body.password, user.password_hash);
    if (!isValidPassword) return res.status(400).json({ ok: false, message: "Incorrect email or password" });

    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "30d" });

    res.status(200).json({ ok: true, token });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ ok: false, message: "Failed to login. Try again" });
  }
};

export const profileHandler = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Get user data'
  /* #swagger.parameters['authorization'] = {
        in: 'header',
        required: 'true',
        type: 'string',
} */
  /* #swagger.responses[200] = {
        description: 'Success',
        schema: { $ref: '#/definitions/User' }
} */
  /* #swagger.responses[401] = {
        description: 'Access denied',
        schema: { $ref: '#/definitions/IncorrectAccessToken' }
} */
  /* #swagger.responses[404] = {
        description: 'User not found',
        schema: { $ref: '#/definitions/NotFoundUser' }
} */
  try {
    const user = await UserModel.findById(req.userId).select([
      "email",
      "movies_ids",
      "tv_shows_ids",
      "suggestions_ids",
      "manual_suggestions_ids",
    ]);

    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    res.status(200).json({ ...user._doc });
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({ ok: false, message: "Access denied" });
  }
};
