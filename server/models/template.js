/**
 * Created by nbhonsale on 3/5/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Template = new Schema(
    {
        _id: Schema.Types.ObjectId,
        name: String,
        creator :
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        phases: [String],
        active: Boolean,
        used: Boolean,
        updated:  {
            type: Date,
            default: Date.now,
            required: true
        }
    });

Template.pre('save', function (next) {
    if (!this.isModified('updated')) this.updated = new Date;
    next();
});

exports.Template = Template;