/**
 * Created by nbhonsale on 3/5/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Session = new Schema(
    {
        _id: Schema.Types.ObjectId,
        username: String,
        created:  {
            type: Date,
            default: Date.now,
            required: true
        }
    });

Session.pre('save', function (next) {
    if (!this.isModified('updated')) this.updated = new Date;
    next();
});

exports.Session = Session;