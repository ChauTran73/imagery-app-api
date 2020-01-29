const express = require('express')
const AuthService = require('./auth-service')
const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
    .post('/login', jsonBodyParser, (req, res, next) => {
        //get username and password out of request body sent from client
        const { user_name, password } = req.body
        //set loginUser with the username and password taken from the req body
        const loginUser = { user_name, password }
        //check if missing keys in loginUser, then throw error
        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        //check if loginUser exists in the db
        AuthService.getUserWithUserName(
            req.app.get('db'),
            loginUser.user_name)
        .then(dbUser => {
            if (!dbUser) //request user does not exist in the db
                return res.status(400).json({
                    error: 'Incorrect user_name or password',
                })
            //after get username from the db (if it exists!), then compare the password in req body with the password in the db
            return AuthService.comparePasswords(loginUser.password, dbUser.password)
                .then(compareMatch => {
                    if (!compareMatch)
                        return res.status(400).json({
                            error: 'Incorrect user_name or password',
                        })
                    //if password matches, create JWT token
                    const sub = dbUser.user_name
                    const payload = { user_id: dbUser.id }
                    res.send({
                        authToken: AuthService.createJwt(sub, payload),
                        
                        sub, //send user_name back to display on navbar
                        payload
                        
                    })
                    res.send('ok')
                })
                .catch(next)


        })
    
    })

module.exports = authRouter