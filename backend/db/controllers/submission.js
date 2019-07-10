const Submission = require('../models/submission.js');

exports.create = (req, res) => {
    let submission = new Submission(req.body);

    return submission.save()
        .then(async submission => {
            return res.json({success: true, data: submission});
        })
        .catch(err => {
            if (err.name === 'ValidationError')
                return res.status(400).json({success: false, error: err});
            return res.status(500).json({success: false, error: err});
        });
};

exports.findByFormId = (req, res) => {
    return Submission.find({form: req.params.formId})
        .then(submissions => {
            return res.json({success: true, data: submissions});
        })
        .catch(err => {
            return res.json({success: false, error: err});
        });
};

exports.findOne = (req, res) => {
    return Submission.findOne({id: req.params.submissionId})
        .then(submission => {
            if (!submission) {
                return res.status(404).send({
                    success: false, error: "Submission not found with id " + req.params.submissionId
                });
            }
            return res.json({success: true, data: submission});
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    success: false, error: "Submission not found with id " + req.params.submissionId
                });
            }
            return res.json({
                success: false, error: "Error retrieving submission with id " + req.params.submissionId
            });
        });
};

exports.deleteAll = () => {
    Submission.deleteMany({}, function (err) {
    })
};
