const express = require('express');
const { FetchUser, AddCategory, UpdateProfilepic } = require('../Controller/User');

const router = express.Router();

router.post('/',FetchUser)
      .post('/category/add', AddCategory)
      .post('/profile/updateprofilepic', UpdateProfilepic)

exports.router = router;