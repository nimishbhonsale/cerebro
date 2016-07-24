/**
 * Created by nbhonsale on 3/5/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema(
    {
        _id: Schema.Types.ObjectId,
        username: String,
        name: String,
        email: String,
        active: Boolean,
        avatar: String,
        password: String,
        updated:  {
            type: Date,
            default: Date.now,
            required: true
        }
    });

User.pre('save', function (next) {
    if (!this.isModified('updated')) this.updated = new Date;
    next();
});

exports.User = User;