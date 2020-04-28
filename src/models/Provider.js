const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const providerSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

providerSchema.pre('save', function(next) {
    const provider = this;
    if(!provider.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            return next(err);
        }

        bcrypt.hash(provider.password, salt, (err, hash) => {
            if(err) {
                return next(err);
            }

            provider.password = hash;
            next();
        });
    });
});

providerSchema.methods.comparePassword = function(candidatePassword) {
    const provider = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, provider.password, (err, isMatch) => {
            if(err) {
                return reject(err);
            }

            if(!isMatch) {
                return reject(false);
            }

            resolve(true);
        });
    });
}

mongoose.model('Provider', providerSchema);
