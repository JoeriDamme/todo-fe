import Joi from "joi";

export const todoPostSchema = Joi.object({
  description: Joi.string().min(1).max(120).required(),
});