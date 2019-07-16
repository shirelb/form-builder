var express = require('express');
var router = express.Router({mergeParams: true});
const submissionStorage = require('../db/controllers/submission');
var request = require('request');

router.get('/', function (req, res, next) {
    submissionStorage.findByFormId(req.params.formId)
        .then(submissions => {
            return res.json({success: true, data: submissions});
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                return res.status(400).json({success: false, error: err});
            if (err.name === 'ReferenceError')
                return res.status(404).json({success: false, error: "Form not found with id " + req.params.formId});
            return res.status(500).json({success: false, error: err});
        });
});

router.post('/submit', function (req, res, next) {
    // submissionStorage.verifyCaptcha(req.body.recaptchaResponse);

    if (req.body.recaptchaResponse === undefined || req.body.recaptchaResponse === '' || req.body.recaptchaResponse === null) {
        return res.status(400).json({success: false, error: "Please select captcha"});
    }
    var secretKey = "6Lco5K0UAAAAAIkyFqfdnCVID8TOQX4zs1GYp-aY";
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body.recaptchaResponse + "&remoteip=" + req.connection.remoteAddress;
    request(verificationUrl, function (error, response, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            return res.status(400).json({success: false, error: "Failed captcha verification"});
        }

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

});

module.exports = router;
