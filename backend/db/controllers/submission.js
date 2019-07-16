const Submission = require('../models/submission.js');
const formStorage = require('./form.js');

exports.create = (submissionReq) => {
    let submission = new Submission(submissionReq);

    return submission.save();
};

exports.findByFormId = async (formId) => {
    return formStorage.findOne(parseInt(formId))
        .then(form => {
            return Submission.find({form: form._id});
        });
};

exports.deleteById = (submissionId) => {
    return Submission.deleteOne({id: submissionId})
};

exports.deleteAll = () => {
    Submission.deleteMany({}, function (err) {
    })
};
