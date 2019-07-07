const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const fieldSchema = new Schema(
    {
        id: Number,
        name: String,
        value:String,
    }
);

const submissionSchema = new Schema(
    {
        formId: Number,
        fields: [fieldSchema]
    },
    {timestamps: true}
);

submissionSchema.plugin(autoIncrement.plugin, {model: 'Submission', field: 'id'});
module.exports = mongoose.model("Submission", submissionSchema);