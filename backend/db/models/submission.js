const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
const exists = require('mongoose-exists');
const Schema = mongoose.Schema;
const constants = require('../../shared/constants');
var sanitizerPlugin = require('mongoose-sanitizer');

const fieldSchema = new Schema(
    {
        id: {
            type: Number,
        },
        value: String,
    }
);

const submissionSchema = new Schema(
    {
        form: {
            type: Schema.Types.ObjectId,
            ref: 'Form',
            exists: true
        },
        fields: {
            type: [fieldSchema],
            validate: {
                validator: function (value) {
                    return value.length > 0
                },
                message: constants.validation.fields.FORM_FIELDS + constants.validation.messages.NO_FIELDS
            },
        }
    },
    {timestamps: true}
);

submissionSchema.plugin(sanitizerPlugin);
submissionSchema.plugin(exists);
submissionSchema.plugin(autoIncrement.plugin, {model: 'Submission', field: 'id'});
module.exports = mongoose.model("Submission", submissionSchema);