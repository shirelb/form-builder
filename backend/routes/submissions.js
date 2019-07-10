var express = require('express');
var router = express.Router({mergeParams: true});
const submissionStorage = require('../db/controllers/submission');

router.get('/', function (req, res, next) {
    submissionStorage.findByFormId(req.params.formId)
        .then(submissions => {
            return res.json({success: true, data: submissions});
        })
        .catch(err => {
            return res.json({success: false, error: err});
        });
});

router.post('/submit', function (req, res, next) {
    submissionStorage.create(req.body)
        .then(submission => {
            return res.json({success: true, data: submission});
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                return res.status(400).json({success: false, error: err});
            return res.status(500).json({success: false, error: err});
        });
});

module.exports = router;
