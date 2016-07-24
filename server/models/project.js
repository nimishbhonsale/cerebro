/**
 * Created by nbhonsale on 3/5/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = new Schema(
    {
        _id: Schema.Types.ObjectId,
        name: String,
        current_phase:String,
        template: {
            type: Schema.Types.ObjectId,
            ref: 'Template'
        },
        description: String,
        thumbnail: String,
        milestones: [
            {
                _id : Schema.Types.ObjectId,
                name : String,
                goal:String,
                phase: String,
                start: Date,
                end: Date,
                sign_off: [{
                    by: {
                        type: Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    approved: Boolean
                }],
                media: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: 'Media'
                    }
                ]
            }
        ],
        /*milestones: [Schema.Types.Mixed],*/
        stakeholders: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
        ],
        /*feedback: [
            {
                id : Schema.Types.ObjectId,
                comment : String,
                type: String,
                detail: String,
                by: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                updated: {
                    type: Date,
                    default: Date.now,
                    required: true
                }
            }
        ],
        risks: [
            {
                _id : Schema.Types.ObjectId,
                title : String,
                serverity: String,
                detail: String,
                by: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                updated: {
                    type: Date,
                    default: Date.now,
                    required: true
                }
            }
        ],*/
        feedback: [Schema.Types.Mixed],
        risks: [Schema.Types.Mixed],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        updated: {
            type: Date,
            default: Date.now,
            required: true
        },
        active: Boolean
    });

Project.pre('save', function (next) {
    if (!this.isModified('updated')) this.updated = new Date;
    next();
});

exports.Project = Project;