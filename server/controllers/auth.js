require('dotenv').config();

const {SECRET} = process.env

const jwt = require('jsonwebtoken');
const {Users} = require('../models/user')
const bcrypt = require('bcryptjs')

const createToken = (username, id) =>{
    return jwt.sign({
        username,
        id
    }, SECRET, {
        expiresIn: '2 days'
    })
}

module.exports = {
    register: async (req, res) => {
        try {
            const{username, password} = req.body
            let foundUser = await Users.findOne({where: {username: username}})
            if(foundUser){
                res.status(400).send('That username is already in use.')
            } else {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password, salt)
                const newUser = await Users.create({username, hashedPass: hash})
                const token = createToken(newUser.dataValues.username, newser.dataValues.id)
                console.log('TOOOOKEN', token)
                const exp = Date.now() + 1000 * 60 * 60 * 48
                res.status(200).send({
                    username: newUser.dataValues.username,
                    userId: newUser.dataValues.id,
                    token,
                    exp})
            }

        } catch(theseHands){
            console.log('ErrorIn Register')
            console.log(theseHands)
            res.status(400).send('error registering')
        }
        console.log('register')
    },

    login: async (req, res) => {
        try {
            const {username, password} = req.body
            let foundUser = await User.findOne({where: {username}})
            if (foundUser) {
                const isAuthenticated = bcrypt.compareSync(password, foundUser.hashedPass)
    
                if (isAuthenticated) {
                    const token = createToken(foundUser.dataValues.username, foundUser.dataValues.id)
                    const exp = Date.now() + 1000 * 60 * 60 * 48
                    res.status(200).send({
                        username: foundUser.dataValues.username,
                        userId: foundUser.dataValues.id,
                        token,
                        exp
                    })
                } else {
                    res.status(400).send('cannot log in')
                }
    
            } else {
                res.status(400).send('cannot log in')
            }
        } catch (error) {
            console.log('ERROR IN register')
            console.log(error)
            res.sendStatus(400)
        }
    },
}