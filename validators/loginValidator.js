const validator = require('validator');

let validate = (user) => {
    let error = {};

    if(!user.email) {
        error.email = 'Email is required';
    } else if(!validator.isEmail(user.email)){
        error.email = 'Email must be valid';
    }
    if(!user.password){
        error.password = 'Password is required';
    } else if(user.password.length < 6){
        error.password = 'Password at least 6 character long';
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate;