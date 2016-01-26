'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
    userName: {
        type: String,
        default: 'na',
        required: 'Please fill Comment name',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    details: {
        type: String,
        default: 'NA',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    saving: {
        type: Schema.ObjectId,
        ref: 'Deal'
    },
    savingId: {
        type: String,
        trim: true
    }

});

mongoose.model('Post', PostSchema);
