const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
        id: Number,
        name: String,
        fields:[{
            id: Number,
            label:String,
            type:String,
            visible:Boolean,
        }]
    },
    { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Form", DataSchema);