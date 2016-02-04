'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Coupon = mongoose.model('Coupon'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a coupon
 */
exports.create = function (req, res) {
  var coupon = new Coupon(req.body);
  coupon.user = req.user;

  coupon.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(coupon);
    }
  });
};

/**
 * Show the current coupon
 */
exports.read = function (req, res) {
  res.json(req.coupon);
};

/**
 * Update a coupon
 */
exports.update = function (req, res) {
  var coupon = req.coupon;

  coupon.title = req.body.title;
  coupon.content = req.body.content;

  coupon.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(coupon);
    }
  });
};

/**
 * Delete an coupon
 */
exports.delete = function (req, res) {
  var coupon = req.coupon;

  coupon.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(coupon);
    }
  });
};

/**
 * List of Coupons
 */
exports.list = function (req, res) {
  Coupon.find().sort('-created').populate('user', 'displayName').exec(function (err, coupons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(coupons);
    }
  });
};

/**
 * Coupon middleware
 */
exports.couponByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Coupon is invalid'
    });
  }

  Coupon.findById(id).populate('user', 'displayName').exec(function (err, coupon) {
    if (err) {
      return next(err);
    } else if (!coupon) {
      return res.status(404).send({
        message: 'No coupon with that identifier has been found'
      });
    }
    req.coupon = coupon;
    next();
  });
};
