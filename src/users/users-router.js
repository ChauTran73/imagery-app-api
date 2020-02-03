const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const ImagesService = require('../images/images-service')
const usersRouter = express.Router()
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

const serializeUser = user => ({
    id: user.id,
    fullname: xss(user.full_name),
    email: xss(user.email),
    date_created: user.date_created
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getAllUsers(knexInstance)
            .then(users => {
                res.json(users.map(serializeUser))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        //get form credentials passed down from the client in the request body
        const { full_name, user_name, email, password } = req.body;
        //set newUser equal the one from req body 
        return UsersService.hashPassword(password)
            .then(hashedPassword => {
                const newUser = {
                    full_name,
                    user_name,
                    password: hashedPassword,
                    email,
                    date_created: 'now()'
                }

                for (const [key, value] of Object.entries(newUser)) {
                    if (value == null)
                        return res.status(400).json({
                            error: { message: `Missing '${key}' in request body` }
                        })
                }
                //validate password: backlog
                // const passwordError = UsersService.validatePassword(password)
                // if (passwordError)
                //     return res.status(400).json({ error: passwordError })

                //set newUser password to the password got from req body
                // newUser.password = password;
                UsersService.hasUserWithUserName(
                    req.app.get('db'),
                    user_name
                )
                    .then(hasUserWithUserName => {
                        if (hasUserWithUserName)
                            return res.status(400).json({ error: `Username already taken` })
                        res.status(201)
                            .location(path.posix.join(req.originalUrl, `/whatever`))
                            .json({
                                id: 'whatever',
                                user_name,
                                full_name,
                                email,
                                date_created: Date.now(),
                            })
                    })
                    .catch(next)
                return UsersService.insertUser(
                    req.app.get('db'),
                    newUser
                )
                    .then(user => {
                        console.log(user)
                        res.status(201) //send status 201 - created to indicate that a newUser has been created in the db
                            .location(path.posix.join(req.originalUrl, `/${user.id}`))
                            .json(serializeUser(user))
                    })
                    .catch(next)

            })
    })
//get images for user 
usersRouter
    .route('/images')
    // .all(checkImageExists)
    .get(requireAuth, (req, res, next) => {
        console.log(req.user)
        UsersService.getImagesForUser(
            req.app.get('db'),
            req.user.id
        )
            .then(images => {
                res.json(images.map(ImagesService.serializeImage))
})
            .catch(next)
    })

usersRouter
    .route('/:user_id')
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.params.user_id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User doesn't exist` }
                    })
                }
                res.user = user
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeUser(res.user))
    })
    .delete((req, res, next) => {
        UsersService.deleteUser(
            req.app.get('db'),
            req.params.user_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            }).catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { full_name, email, password } = req.body
        const userToUpdate = { full_name, email, password }
        const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain either, fullname, 'password'`
                }
            })
        UsersService.updateUser(
            req.app.get('db'),
            req.params.user_id,
            userToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            }).catch(next)
    })
module.exports = usersRouter;