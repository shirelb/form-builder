var express = require('express');
var router = express.Router({mergeParams: true});
const submissionStorage = require('../db/controllers/submission');

router.get('/', async function (req, res, next) {
    await submissionStorage.findByFormId(req, res);
});

router.post('/submit', async function (req, res, next) {
    await submissionStorage.create(req, res);
});

module.exports = router;
