'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Coupon = mongoose.model('Coupon'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

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

    //coupon.title  = req.body.title;
    //coupon.retailer  = req.body.retailer;
    //coupon.price  = req.body.price;
    //coupon.image  = req.body.image;
    //coupon.votes = req.body.votes;
    //coupon.urlimage  = req.body.urlimage;
    //coupon.tags  = req.body.tags;
    //coupon.upVoters  = req.body.upVoters;
    //coupon.downVoters  = req.body.downVoters;
    //coupon.link  = req.body.link;
    //coupon.details  = req.body.details;

    coupon = _.extend(coupon, req.body);

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
    Coupon.find().sort('-created').populate('user').exec(function (err, coupons) {
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

    Coupon.findById(id).populate('user').exec(function (err, coupon) {
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

/**
 * Count of Deals
 */
exports.countCoupons = function (req, res) {
    Coupon.count({},

        function (err, couponsCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = couponsCount;
                res.jsonp(data);
            }
        });
};

/**
 * Count of Coupons
 */
exports.usersCouponsPostedTotal = function (req, res) {
    Coupon.count({},

        function (err, couponsCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = couponsCount;
                res.jsonp(data);
            }
        });
};

/**
 * Count of Deals Today
 */
exports.countCouponsToday = function (req, res) {
    Coupon.count({

            $where: function () {
                return Date.now() - this._id.getTimestamp() < (24 * 60 * 60 * 1000);
            }

        },

        function (err, couponsCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = couponsCount;
                res.jsonp(data);
            }
        });
};

/**
 * Update product picture
 */
exports.changeProductPictureCoupon = function (req, res) {

    var user = req.user;
    var message = null;

    if (user) {
        fs.writeFile('./modules/coupons/client/img/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
            if (uploadError) {
                return res.status(400).send({
                    message: 'Error occurred while uploading profile picture'
                });
            } else {

                user.imageURL = './modules/coupons/client/img/uploads/' + req.files.file.name;

                user.save(function (saveError) {
                    if (saveError) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(saveError)
                        });
                    } else {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};
