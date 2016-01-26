'use strict';

/**
 * Module dependencies.
 */
var
    mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    errorHandler = require('./errors.server.controller'),
    Deal = mongoose.model('Deal'),
    _ = require('lodash');

/**
 * Create a Deal
 */
exports.create = function (req, res) {
    var deal = new Deal(req.body);
    deal.user = req.user;

    deal.save(function (err) {
        if (err) {
            return res.status(400).send({
                 message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(deal);
        }
    });
};

/**
 * Show the current Deal
 */
exports.read = function (req, res) {
    res.jsonp(req.deal);
};

/**
 * Update a Deal
 */
exports.update = function (req, res) {

    var deal = req.deal;

    deal = _.extend(deal, req.body);

    deal.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(deal);
        }
    });
};

/**
 * Delete a Deal
 */
exports.delete = function (req, res) {
    var deal = req.deal;

    deal.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(deal);
        }
    });
};

/**
 * List of Deals
 */
exports.list = function (req, res) {
    Deal.find().sort('-created').populate('user', 'displayName').exec(function (err, deals) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(deals);
        }
    });
};

/**
 * Count of Deals
 */
exports.countDeals = function (req, res) {
    Deal.count({},

        function (err, dealsCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = dealsCount;
                res.jsonp(data);
            }
        });
};

/**
 * Count of Deals Today
 */
exports.countDealsToday = function (req, res) {
    Deal.count({

            $where: function () {
                return Date.now() - this._id.getTimestamp() < (24 * 60 * 60 * 1000);
            }

        },

        function (err, dealsCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = dealsCount;
                res.jsonp(data);
            }
        });
};

///**
// * Check If Voted
// */
//exports.dealByIdAndVoter = function(req, res) {
//    Deal.count({
//
//            $where: function () {
//
//
//
//            }
//
//    },
//        function(err, dealByIdAndVoter) {
//            if (err) {
//                return res.status(400).send({
//                    message: errorHandler.getErrorMessage(err)
//                });
//            } else {
//                console.log(dealByIdAndVoter);
//                var data = {};
//                data.count = dealByIdAndVoter;
//                res.json(data);
//            }
//        });
//};

///**
// * List of Comments
// */
//exports.list = function (req, res, id) {
//
//    Deal.findById(id).sort('-created').populate('user', 'displayName').exec(function (err, deals) {
//        if (err) {
//            return res.status(400).send({
//                message: errorHandler.getErrorMessage(err)
//            });
//        } else {
//            res.jsonp(deals);
//        }
//    });
//};




/**
 * Deal middleware
 */
exports.dealByID = function (req, res, next, id) {

    Deal.findById(id).populate('user', 'displayName').exec(function (err, deal) {
        if (err) return next(err);
        if (!deal) return next(new Error('Failed to load Deal ' + id));
        req.deal = deal;
        next();
    });


};

/**
 * Deal authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.deal.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
//
//var item = new Item(JSON.parse(req.body.item));
//item.user = req.user;
//if(req.files.file)
//    item.image=req.files.file.name;
//else
//    item.image='default.jpg';
//
////item.image=
//item.save(function(err) {
//    if (err) {
//        return res.status(400).send({
//            message: errorHandler.getErrorMessage(err)
//        });
//    } else {
//        res.jsonp(item);
//    }
//});

///**
// * Upload product picture
// */
//exports.changeProductPicture = function (req, res) {
//
//    var user = req.user;
//
//        fs.writeFile('./modules/deals/client/img/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
//            if (uploadError) {
//                return res.status(400).send({
//                    message: 'Error occurred while uploading profile picture'
//                });
//            } else {
//
//                if (user) {
//                    user.profileImageURL = './modules/deals/client/img/uploads/' + req.files.file.name;
//                    user.imageURL = './modules/deals/client/img/uploads/' + req.files.file.name;
//                }
//
//                res.json(user);
//
//
//            }
//        });
//
//};

/**
 * Update profile picture
 */
exports.changeProductPicture = function (req, res) {
    var user = req.user;
    var message = null;

    if (user) {
        fs.writeFile('./modules/deals/client/img/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
            if (uploadError) {
                return res.status(400).send({
                    message: 'Error occurred while uploading profile picture'
                });
            } else {

                user.imageURL = './modules/deals/client/img/uploads/' + req.files.file.name;

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



