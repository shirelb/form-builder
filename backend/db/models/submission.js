const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const fieldSchema = new Schema(
    {
        id: Number,
        value:String,
    }
);

const submissionSchema = new Schema(
    {
        form:{ type: Schema.Types.ObjectId, ref: 'Form' },
        fields: [fieldSchema]
    },
    {timestamps: true}
);

submissionSchema.plugin(autoIncrement.plugin, {model: 'Submission', field: 'id'});
module.exports = mongoose.model("Submission", submissionSchema);