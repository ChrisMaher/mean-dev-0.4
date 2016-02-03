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
    votes: {
        type: Number,
        default: '0'
    },
    voters: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
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
