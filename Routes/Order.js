const express = require('express');
const { CreateOrder, FetchOrder } = require('../Controller/Order');

const router = express.Router();

router.post('/add', CreateOrder)
      .get('/:id', FetchOrder)

exports.router = router