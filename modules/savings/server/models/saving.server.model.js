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
    required: 'We need a Title for the Deal.',
    trim: true
  },
  link: {
    type: String,
    required: 'We need a Link to the deal.',
    trim: true
  },
  details: {
    type: String,
    default: 'NA',
    trim: true
  },
  retailer: {
    type: String,
    required: 'We need a Retailer for the Deal.',
    trim: true
  },
  price: {
    type: Number,
    required: 'We need a Price for the Deal.',
    trim: true
  },
  currency: {
    type: String,
    default: 'Euro (&euro;)',
    required: 'We need a Currency for the Deal.',
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
    required: 'We need a category for the Deal.',
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
    default: '100'
  },
  votesreal: {
    type: Number,
    default: '100'
  },
  upVoters: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  downVoters: [{
    type: Schema.ObjectId,
    ref: 'User'
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
