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

