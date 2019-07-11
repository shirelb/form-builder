const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
const constants = require('../../shared/constants');
var sanitizerPlugin = require('mongoose-sanitizer');

const fieldSchema = new Schema(
    {
        id: {
            type: Number,
        },
        label: {
            type: String,
            validate: {
                validator: function (value) {
                    return value.length > 0
                },
                message: constants.validation.fields.FIELD_LABEL + constants.validation.messages.NOT_EMPTY
            },
        },
        name: {
            type: String,
            validate: [
                {
                    validator: function (value) {
                        return value.length > 0
                    },
                    message: constants.validation.fields.FIELD_NAME + constants.validation.messages.NOT_EMPTY
                },
                {
                    validator: function (value) {
                        return /^\S*$/.test(value)
                    },
                    message: constants.validation.fields.FIELD_NAME + constants.validation.messages.NO_SPACES
                },
            ]
        },
        type: {
            type: String,
            validate: [
                {
                    validator: function (value) {
                        return value.length > 0
                    },
                    message: constants.validation.fields.FIELD_TYPE + constants.validation.messages.NOT_EMPTY
                },
                {
                    validator: function (value) {
                        return constants.fieldType.includes(value)
                    },
                    message: constants.validation.fields.FIELD_TYPE + constants.validation.messages.NOT_CONTAINS + constants.fieldType.join(',')
                },
            ]
        },
    }
);

const formSchema = new Schema(
    {
        name: {
            type: String,
            validate: {
                validator: function (value) {
                    return value.length > 0
                },
                message: constants.validation.fields.FORM_NAME + constants.validation.messages.NOT_EMPTY
            },
        },
        fields: {
            type: [fieldSchema],
            validate: {
                validator: function (value) {
                    return value.length > 0
                },
                message: constants.validation.fields.FORM_FIELDS + constants.validation.messages.NO_FIELDS
            },
        },
    },
    {timestamps: true}
);

formSchema.plugin(sanitizerPlugin);
formSchema.plugin(autoIncrement.plugin, {model: 'Form', field: 'id'});
module.exports = mongoose.model("Form", formSchema);