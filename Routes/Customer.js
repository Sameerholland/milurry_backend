const express = require('express');
const { CreateCustomer, LoginCustomer, CheckCustomer } = require('../Controller/Customer');


const router = express.Router();
const passport = require('passport')

router.post('/add',CreateCustomer)
      .post('/login',LoginCustomer)
      .get('/check',passport.authenticate('jwt'),CheckCustomer)

exports.router = router;