const registerValidate = require('../validators/validator');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const loginValidate = require('../validators/loginValidator');
const  {serverError, resourceError} = require('../utill/error');
const jwt = require('jsonwebtoken');

module.exports = {
    login(req,res) {
        let {email,password} = req.body;
        let validate = loginValidate({email,password});
        if(!validate.isValid){
            return res.status(400).json(validate.error);
        } else {
            User.findOne({email})
            .then(user => {
                if(!user){
                    return resourceError(res, 'User not found');
                }
                bcrypt.compare(password, user.password, (err, result) => {
                    if(err){
                        return serverError(res, err);
                    }
                    if(!result){
                        return resourceError(res, 'Password do not match');
                    }
                    let token = jwt.sign({
                        _id: user._id,
                        name: user.name,
                        email: user.email
                    }, 'SECRET', {expiresIn: '2h'});

                    return res.status(200).json({
                        message: 'Login successful',
                        token: `Bearer ${token}`
                    });
                });
            })
            .catch(error => serverError(res, error));
        }
    },

    register(req,res) {
        let {name, email, password, confirmPassword} = req.body;
        let validate = registerValidate({name, email, password, confirmPassword});
        if(!validate.isValid){
            res.status(400).json(validate.error);
        } else {
            // res.status(200).json({message: 'Everything ok'});
            User.findOne({email})
            .then(user => {
                if(user){
                    return resourceError(res, 'Email already exist');
                }

                bcrypt.hash(password, 11, (err, hash) => {
                    if(err){
                        return resourceError(res, 'Server error occured');
                    }

                    let user = new User({
                        name,
                        email,
                        password: hash
                    });
                    user.save()
                    .then(user => {
                        return res.status(201).json({
                            message: 'User created successfully'
                        });
                    })
                    .catch(error => serverError(res, error));
                });
            })
            .catch(error => serverError(res, error));
        }
    }
}