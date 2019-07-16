var express = require('express');
var router = express.Router();
const formStorage = require('../db/controllers/form');
var submissionsRouter = require('./submissions');

router.get('/', function (req, res, next) {
    formStorage.findAll()
        .then(forms => {
            return res.json({success: true, data: forms});
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                return res.status(400).json({success: false, error: err});
            return res.status(500).json({success: false, error: err});
        });
});

router.get('/:formId', function (req, res, next) {
    formStorage.findOne(req.params.formId)
        .then(form => {
            return res.json({success: true, data: form});
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                return res.status(400).json({success: false, error: err});
            if (err.name === 'ReferenceError')
                return res.status(404).json({success: false, error: "Form not found with id " + req.params.formId});
            return res.status(500).json({success: false, error: err});
        });
});

router.post('/build', function (req, res, next) {
    formStorage.create(req.body)
        .then(form => {
            return res.json({success: true, data: form});
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                return res.status(400).json({success: false, error: err});
            return res.status(500).json({success: false, error: err});
        });
});

router.delete('/:formId', function (req, res, next) {
    formStorage.deleteById(req.params.formId)
        .then(response => {
            if (response.deletedCount > 0 && response.ok > 0) {
                formStorage.findAll()
                    .then(forms => {
                        return res.json({success: true, data: forms});
                    })
                    .catch(err => {
                        if (err.name === 'ValidationError')
                            return res.status(400).json({success: false, error: err});
                        return res.status(500).json({success: false, error: err});
                    });
            } else
                return res.status(500).json({success: false});
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                return res.status(400).json({success: false, error: err});
            if (err.name === 'ReferenceError')
                return res.status(404).json({success: false, error: "Form not found with id " + req.params.formId});
            return res.status(500).json({success: false, error: err});
        });
});

router.use('/:formId/submissions', submissionsRouter);

module.exports = router;
