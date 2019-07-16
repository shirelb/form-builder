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

exports.deleteAll = () => {
    Submission.deleteMany({}, function (err) {
    })
};

exports.verifyCaptcha = (recaptchaResponse) => {
};
