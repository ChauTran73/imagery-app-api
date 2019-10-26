//create user service objects to manage db interactions
const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('imagery_users')
    },
    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('imagery_users')
            .returning('*')
            .then(rows => { return rows[0] })
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
    }
}
module.exports = UsersService;