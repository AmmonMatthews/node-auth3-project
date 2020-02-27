const db = require('../data/dbConfig.js')

module.exports = {
    find,
    add, 
    findBy
}

function find(){
    return db('users')
    .select("id", "username", "password")
}

function add(user){
    return db('users')
    .insert(user, "id")
}

function findBy(id){
    return db('users')
    .select('id', 'username', 'password')
    .where(id)
    .first();
}