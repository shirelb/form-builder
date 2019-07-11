const Submission = require('../models/submission.js');

exports.create = (submissionReq) => {
    let submission = new Submission(submissionReq);

    return submission.save();
};

exports.findByFormId = (formDocId) => {
    return Submission.find({form: formDocId});
};

exports.deleteAll = () => {
    Submission.deleteMany({}, function (err) {
    })
};
