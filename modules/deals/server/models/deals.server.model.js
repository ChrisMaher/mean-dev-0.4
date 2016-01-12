'use strict';

/**
 * Module dependencies.
 */

//title: this.title,
//details: this.details,
//retailer: this.retailer,
//price: this.price,
//image: this.image,
//urlimage: this.urlimage,
//tags: this.tags,
//startdate: this.startdate,
//enddate: this.enddate

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



/**
 * Deal Schema
 */
var DealSchema = new Schema({
    title: {
        type: String,
        default: 'NA',
        required: 'Please fill Deal title',
        trim: true
    },
    link: {
        type: String,
        required: 'Please fill Deal URL',
        trim: true
    },
    details: {
        type: String,
        default: 'NA',
        required: 'Please fill Deal Details',
        trim: true
    },
    retailer: {
        type: String,
        default: 'NA',
        required: 'Please fill Deal Retailer',
        trim: true
    },
    price: {
        type: String,
        default: '0',
        required: 'Please fill Deal Price',
        trim: true
    },
    urlimage: {
        type: String,
        default: 'http://placehold.it/120x120?text=no+image',
        trim: true
    },
    image: {
        type: String,
        default: 'http://placehold.it/120x120?text=no+image'
    },
    tags: {
        type: String,
        default: 'NA',
        required: 'Please fill Deal Tags',
        trim: true
    },
    startdate: {
        type: String,
        default: 'NA',
        trim: true
    },
    enddate: {
        type: String,
        default: 'NA',
        trim: true
    },
    votes: {
        type: Number,
        default: '0'
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Deal', DealSchema);
