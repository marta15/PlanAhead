const Joi = require('joi');

module.exports.planSchema = Joi.object({
    plan: Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        duration: Joi.number().required().min(1),
        description: Joi.string(),
        image: Joi.string()
    }).required()
})

module.exports.daySchema = Joi.object({
    day: Joi.object({
        dayOfTheWeek: Joi.string().required(),
        date: Joi.string().required().required(),
        steps: Joi.array().items(Joi.string())
    }).required()
})

