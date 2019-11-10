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
    getImagesForUser(db, user_id) { //get all images created by a user 
        return db
            .from('imagery_images AS image')
            .select(
                'image.id',
                'image.title',
                'image.image_url',
                'image.description',
                db.raw(
                    `json_strip_nulls(
                    row_to_json(
                        (SELECT tmp FROM (
                            SELECT
                            usr.id,
                  usr.email,
                  usr.full_name,
                  usr.user_name,
                  usr.date_created,
                  usr.date_modified
              ) tmp)
            )
          ) AS "author"`
                )
            )
            .where('image.author_id', user_id)
            .leftJoin(
                'imagery_users AS usr',
                'image.author_id',
                'usr.id',
        )
            .groupBy('image.id', 'usr.id')
    },
}
module.exports = UsersService;