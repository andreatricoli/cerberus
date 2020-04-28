const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Provider = mongoose.model('Provider');

const router = express.Router();

//registrati come Provider
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const provider = new Provider({email, password});
        await provider.save();

        const token = jwt.sign({providerId: provider._id}, 'MY_SECRET_KEY');
        res.send({token});
    } catch(err) {
        res.status(422).send(err.message);
    }

});

//accedi come Provider
router.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(422).send({error: 'Must provide email and password'});
    }

    const provider = await Provider.findOne({email});
    if(!provider) {
        return res.status(422).send({error: 'Email not found'});
    }

    try{
        await provider.comparePassword(password);
        const token = jwt.sign({providerId: provider._id}, 'MY_SECRET_KEY');
        res.send({token});
    } catch(err) {
        return res.status(422).send({error: 'Invalid password for email'});
    }

})

module.exports = router;