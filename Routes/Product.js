const express = require('express');
const { AddProducts, FetchProducts } = require('../Controller/Product');
const router = express.Router()

router.post('/add',AddProducts)
      .get('/:id',FetchProducts)

exports.router = router;