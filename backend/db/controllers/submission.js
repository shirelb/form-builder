const Submission = require('../models/submission.js');

exports.create = (submissionReq) => {
    let submission = new Submission(submissionReq);

    return submission.save();
};

exports.findByFormId = (formId) => {
    return Submission.find({form: formId});
};

exports.deleteAll = () => {
    Submission.deleteMany({}, function (err) {
    })
};
