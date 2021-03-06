const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return(req,res,next) => {
            const result = Joi.validate(req.body, schema);
            // console.log(result.error);
            if(result.error) {
                return res.status(422).send({ error : 'Invalid Credentials'})
            }

            // req.value.body instead req.body
            if(!req.value) { req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {
        authSchema: Joi.object().keys({
           
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
         
        })
    },

    chefSignupSchema: {
        authSchema: Joi.object().keys({
            name: Joi.string().min(5).max(20).required(),
            location: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            phone:Joi.number().min(1000000000,9999999999).required()
        })
    },

    signInSchema: {
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
         
        })
    },

    confirmPassword: {
        authSchema: Joi.object().keys({
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            confirmPassword: Joi.any().valid(Joi.ref('password')).required()
         })
    },

    editChefProfile: {
        authSchema: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone :Joi.number().min(1000000000).max(9999999999).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()      
        })
    },
    checkEmail:{
        authSchema: Joi.object().keys({
            email: Joi.string().email().required()
        })
    }


}