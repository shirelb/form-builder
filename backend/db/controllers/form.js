const Form = require('../models/form.js');

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
        .then(forms => {
            return res.json({success: true, data: forms});
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