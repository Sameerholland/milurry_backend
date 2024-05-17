const express = require('express');
const { FetchDashboardData } = require('../Controller/Dashboard');
const router = express.Router();

router.get('/:id', FetchDashboardData);

exports.router =router ;