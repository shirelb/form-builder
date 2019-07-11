const Form = require('../models/form.js');
const Submission = require('../models/submission.js');

exports.create = (formReq) => {
    const {name, fields} = formReq;

    let form = new Form();

    form.name = name;
    form.fields = fields;

    return form.save();
};

exports.findAll = () => {
    return Form.find()
        .then(async forms => {
            let submissionsGroupByForm = await Submission.aggregate([
                {
                    $group: {
                        _id: "$form",
                        total: {$sum: 1}
                    }
                }
            ]);

            let formsWithNumOfSubmissions = forms.map(form => {
                let submissionsNum = submissionsGroupByForm.find(submissionCount => form._id.toString() === submissionCount._id.toString());
                return Object.assign(form._doc, {submissionsNum: submissionsNum ? submissionsNum.total : 0})
            });

            return formsWithNumOfSubmissions;
        })
};

exports.findOne = (formId) => {
    return Form.findOne({id: formId})
        .then(form => {
            if (!form) {
                throw new ReferenceError("Form not found with id " + formId);
            }
            return form;
        })
};

exports.findByDocId = (formId) => {
    return Form.findById(formId)
        .then(form => {
            if (!form) {
                return {
                    success: false, error: "Form not found with id " + formId
                };
            }
            return {success: true, data: form};
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return {
                    success: false, error: "Form not found with id " + formId
                };
            }
            return {
                success: false, error: "Error retrieving form with id " + formId
            };
        });
};

exports.deleteAll = () => {
    Form.deleteMany({}, function (err) {
    })
};