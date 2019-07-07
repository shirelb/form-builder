var express = require('express');
var router = express.Router();
const Submission = require('../db/models/submission');
const submissionStorage = require('../db/controllers/submission');

router.get('/:formId', async function (req, res, next) {
    await submissionStorage.findByFormId(req, res);
});

router.post('/:formId/submit', async function (req, res, next) {
    const {submission} = req.body;

    //TODO complete validations
    /*    if ((!id && id !== 0)) {
            return res.json({
                success: false,
                error: 'INVALID INPUTS',
            });
        }*/
    await submissionStorage.create(req, res);
});

module.exports = router;
