var express = require('express');
var router = express.Router();
const formStorage = require('../db/controllers/form');
var submissionsRouter = require('./submissions');

router.get('/', async function (req, res, next) {
    await formStorage.findAll(req, res);
});

router.get('/:formId', async function (req, res, next) {
    await formStorage.findOne(req, res);
});

router.post('/build', async function (req, res, next) {
    await formStorage.create(req, res);
});

router.delete('/:formId', async function (req, res, next) {
    await formStorage.delete(req, res);
});

router.use('/:formId/submissions', submissionsRouter);

module.exports = router;
