//create user service objects to manage db interactions
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('imagery_users')
    },
    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('imagery_users')
            .returning('*')
            // .then(rows => { return rows[0] })
            .then(([user]) => user)
    },
    getById(knex, id) {
        return knex
            .from('imagery_users')
            .where({ id })
            .first()
    },
    deleteUser(knex, id) {
        return knex
            .from('imagery_users')
            .where({ id })
            .delete()
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 
                'Password must be longer than 8 characters'
            
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            full_name: xss(user.full_name),
            user_name: xss(user.user_name),
            email: xss(user.email),
            date_created: new Date(user.date_created),
        }
    },
    hasUserWithUserName(knex, user_name) {
        return knex('imagery_users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },
}
module.exports = UsersService;