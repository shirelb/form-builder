const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const fieldSchema = new Schema(
    {
        id: Number,
        label: String,
        name: String,
        type: String,
        visible: Boolean,
    }
);

const formSchema = new Schema(
    {
        name: String,
        fields: [fieldSchema],
    },
    {timestamps: true}
);

formSchema.plugin(autoIncrement.plugin, {model: 'Form', field: 'id'});
module.exports = mongoose.model("Form", formSchema);