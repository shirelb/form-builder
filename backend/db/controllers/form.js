const Form = require('../models/form.js');
const Submission = require('../models/submission.js');

exports.create = (req, res) => {
    const {name, fields} = req.body;

    let form = new Form();

    form.name = name;
    form.fields = fields;

    return form.save()
        .then(form => {
            return res.json({success: true, data: form});
        })
        .catch(err => {
            return res.json({success: false, error: err});
        });
};

exports.findAll = (req, res) => {
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

            return res.json({success: true, data: formsWithNumOfSubmissions});
        })
        .catch(err => {
            return res.json({success: false, error: err});
        });
};

exports.findOne = (req, res) => {
    return Form.findOne({id: req.params.formId})
        .then(form => {
            if (!form) {
                return res.status(404).send({
                    success: false, error: "Form not found with id " + req.params.formId
                });
            }
            return res.json({success: true, data: form});
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    success: false, error: "Form not found with id " + req.params.formId
                });
            }
            return res.json({
                success: false, error: "Error retrieving form with id " + req.params.formId
            });
        });
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

//todo complete update
exports.update = (req, res) => {
    // Find form and update it with the request body
    return Form.findByIdAndUpdate(req.params.formId, {
        title: req.body.title || "Untitled Form",
        content: req.body.content
    }, {new: true})
        .then(form => {
            if (!form) {
                return res.status(404).send({
                    success: false, error: "Form not found with id " + req.params.formId
                });
            }
            res.send(form);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    success: false, error: "Form not found with id " + req.params.formId
                });
            }
            return res.status(500).send({
                success: false, error: "Error updating form with id " + req.params.formId
            });
        });

    const {id, updatedForm} = req.body;
    return Form.findByIdAndUpdate(id, updatedForm, (err) => {
        if (err)
            return res.json({success: false, error: err});
        return res.json({success: true});
    });
};

exports.delete = (req, res) => {
    return Form.findOneAndRemove({id: req.params.formId})
        .then(form => {
            if (!form) {
                return res.status(404).send({
                    success: false, error: "Form not found with id " + req.params.formId
                });
            }
            return res.send({success: true});
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    success: false, error: "Form not found with id " + req.params.formId
                });
            }
            return res.status(500).send({
                success: false, error: "Could not delete form with id " + req.params.formId
            });
        });
};

exports.deleteAll = () => {
    Form.deleteMany({}, function (err) {
    })
};