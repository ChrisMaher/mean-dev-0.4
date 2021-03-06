'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Saving Schema
 */
var SavingSchema = new Schema({

  title: {
    type: String,
    required: 'Title cannot be blank',
    trim: true,
    maxlength: 150
  },
  link: {
    type: String,
    required: 'We need a Link to the Saving.',
    trim: true
  },
  details: {
    type: String,
    default: 'NA',
    trim: true
  },
  retailer: {
    type: String,
    required: 'We need a Retailer for the Saving.',
    maxlength: 25,
    trim: true
  },
  userIdString: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: 'We need a Price for the Saving.',
    trim: true,
    min: 0,
    max: 1000000
  },
  currency: {
    type: String,
    required: 'We need a Currency for the Saving.',
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
  category: {
    type: String,
    default: 'All',
    required: 'We need a category for the Saving.',
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
    default: 100
  },
  votesreal: {
    type: Number,
    default: 100
  },
  reported: {
    type: Boolean,
    default: false
  },
  commentcount: {
    type: Number,
    default: 0,
    min: 0
  },
  upVoters: [{
    type: String,
    default: 'NA',
    trim: true
  }],
  downVoters: [{
    type: String,
    default: 'NA',
    trim: true
  }],
  votesTrim: [{
    type: String
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }

});

mongoose.model('Saving', SavingSchema);
