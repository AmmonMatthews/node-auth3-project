const bcrypt = require('bcryptjs');
const express = require('express');

const Users = require('./user-modules.js');
const restricted = require('../data/restricted-middleware.js');
const jwtSecret = require('../config/secrets.js');

const router = express.Router();

router.get("/users", restricted, (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => res.send(err));
})

router.post("/register", (req, res) => {
    let user = req.body

    const hash = bcrypt.hashSync(user.password, 10)

    user.password = hash
    Users.add(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(error => {
            res.status(500).json(error);
          });
})

router.post("/login", (req, res) => {
    const { username, password} = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)){
               const token =generateToke(user)

                res.status(200).json({ message: `Welcome ${user.username}`, token});
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
              }
        })
        .catch(error => {
            res.status(500).json(error);
          });
});

router.get("/logout", (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({
                    you: "can check out any time you like, but you can never leave"
                });
            } else {
                res.status(200).json({ you: "logged out successfully"});
            }
        });
    } else {
        res.status(200).json({ bye: "felicia"})
    }
})


function generateToke(user){
    const payload = {
        subjet: user.id
    }

    const options ={
        expiresIn: "1hr",
    }

    return jwt.sign(payload, jwtSecret, options)
}
module.exports = router