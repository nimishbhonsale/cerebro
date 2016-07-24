/**
 * Created by nbhonsale on 3/5/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Media = new Schema(
    {
        _id: Schema.Types.ObjectId,
        title: String,
        description: String,
        tags: [String],
        thumbnail: String,
        uri: String,
        type: String,
        filetype: String,
        is_primary: Boolean,
        creator :
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comments: [
            {
                comment: String,
                by: {
                    ref: 'User',
                    type: Schema.Types.ObjectId
                }
            }
        ],
        likes: Number,
        active: Boolean,
        updated: {
            type: Date,
            default: Date.now,
            required: true
        }
    });

Media.pre('save', function (next) {
    if (!this.isModified('updated')) this.updated = new Date;
    next();
});

exports.Media = Media;