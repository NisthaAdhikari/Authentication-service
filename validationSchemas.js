const Joi = require('joi');

const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
  fullName: Joi.string().required(),
});


const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
})

module.exports = {
  registerUserSchema,
  loginUserSchema
};