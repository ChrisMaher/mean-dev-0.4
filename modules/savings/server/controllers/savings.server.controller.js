'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Saving = mongoose.model('Saving'),
    User = mongoose.model('User'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a saving
 */
exports.create = function (req, res) {
    var saving = new Saving(req.body);
    saving.user = req.user;

    saving.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(saving);
        }
    });
};

/**
 * Show the current saving
 */
exports.read = function (req, res) {
    res.json(req.saving);
};

/**
 * Update a saving
 */
exports.update = function (req, res) {

    var saving = req.saving;

    //saving.title  = req.body.title;
    //saving.retailer  = req.body.retailer;
    //saving.price  = req.body.price;
    //saving.image  = req.body.image;
    //saving.votes = req.body.votes;
    //saving.votesreal = req.body.votesreal;
    //saving.urlimage  = req.body.urlimage;
    //saving.tags  = req.body.tags;
    //saving.upVoters  = req.body.upVoters;
    //saving.downVoters  = req.body.downVoters;
    //saving.link  = req.body.link;
    //saving.details  = req.body.details;
    //saving.currency  = req.body.currency;

    saving = _.extend(saving, req.body);

    saving.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(saving);
        }
    });
};

/**
 * Delete an saving
 */
exports.delete = function (req, res) {
    var saving = req.saving;

    saving.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(saving);
        }
    });
};

/**
 * List of Savings
 */
exports.list = function (req, res) {
    Saving.find().sort('-created').populate('user').exec(function (err, savings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(savings);
        }
    });
};

/**
 * Saving middleware
 */
exports.savingByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Saving is invalid'
        });
    }

    Saving.findById(id).populate('user').exec(function (err, saving) {
        if (err) {
            return next(err);
        } else if (!saving) {
            return res.status(404).send({
                message: 'No saving with that identifier has been found'
            });
        }
        req.saving = saving;
        next();
    });
};

/**
 * Count of Deals
 */
exports.countSavings = function (req, res) {
    Saving.count({},

        function (err, savingsCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)

                });
            } else {
                var data = {};
                data.count = savingsCount;
                res.jsonp(data);
            }
        });
};

///**
// * Count of Deals by User
// */
//exports.usersSavingsPostedTotal = function (req, res) {
//
//    Saving.count({
//
//            $where: function () {
//                return this.userIdString === req.params.userIdString;
//            }
//
//    },
//
//        function (err, savingsCount) {
//            if (err) {
//                return res.status(400).send({
//
//                    message: errorHandler.getErrorMessage(err)
//
//                });
//            } else {
//                var data = {};
//                data.count = savingsCount;
//                res.jsonp(data);
//            }
//        });
//};

exports.usersSavingsPostedTotal = function(req, res) {

    Saving.find( {

        userIdString: req.params.userIdString }).sort('-created').populate('_id').exec(function (err, savings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(savings);
        }
    });
};

// Count Upvotes by a user

exports.usersUpvotesTotal = function(req, res) {

    Saving.find( {

        upVoters: req.params.userIdString }).sort('-created').populate('_id').exec(function (err, savings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(savings);
        }
    });
};

// Count Upvotes by a user

/**
 * List of Savings
 */
exports.removeVotesDaily = function (req, res) {

    Saving.find().sort('created').populate('votes').exec(function (err, savings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            for (var i = 0; i < savings.length; i++) {

                if(savings[i].votes > 100){

                    savings[i].votes = savings[i].votes - (savings[i].votes / 5);
                    savings[i].update();
                    console.log("removed votes");

                }else{
                    savings[i].votes = 100;
                    console.log("changed to 100");
                }


            }


            res.json(savings);
        }
    });

};

/**
 * App Upvote a saving.
 */
exports.appUpvoteSaving = function (req, res) {

    var saving = req.saving;

    saving = _.extend(saving, req.body);

    var hasVoted = saving.upVoters.filter(function (voter) {

            return voter === req.params.email;

        }).length > 0;

    if(!hasVoted){

        saving.votes++;
        saving.votesreal++;
        saving.upVoters.push(req.params.email);

    }

    var hasVoted3 = saving.downVoters.filter(function (voter) {

            return voter === req.params.email;

        }).length > 0;

    if (hasVoted3) {

        for (var i = saving.downVoters.length - 1; i >= 0; i--) {

            if (saving.downVoters[i] === req.params.email) {
                saving.downVoters.splice(i, 1);
            }
        }
    }

    saving.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(saving);
        }
    });
};

// Count Upvotes by a user

/**
 * List of Savings
 */
exports.removeVotesDaily = function (req, res) {

    Saving.find().sort('created').populate('votes').exec(function (err, savings) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            for (var i = 0; i < savings.length; i++) {

                if(savings[i].votes > 100){

                    savings[i].votes = savings[i].votes - (savings[i].votes / 5);
                    savings[i].update();
                    console.log("removed votes");

                }else{
                    savings[i].votes = 100;
                    console.log("changed to 100");
                }


            }


            res.json(savings);
        }
    });

};

/**
 * App Upvote a saving.
 */
exports.appDownvoteSaving = function (req, res) {



    var saving = req.saving;

    saving = _.extend(saving, req.body);

    var hasVoted4 = saving.downVoters.filter(function (voter) {

            return voter === req.params.email;

        }).length > 0;

    if(!hasVoted4){

        saving.votes--;
        saving.votesreal--;
        saving.downVoters.push(req.params.email);

    }

    var hasVoted3 = saving.upVoters.filter(function (voter) {

            return voter === req.params.email;

        }).length > 0;

    if (hasVoted3) {

        for (var i = saving.upVoters.length - 1; i >= 0; i--) {

            if (saving.upVoters[i] === req.params.email) {
                saving.upVoters.splice(i, 1);
            }
        }
    }



    saving.save(function (err) {
        if (err) {
            console.log(req.params.email);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)

            });

        } else {
            res.json(saving);
            console.log(req.params.email);
        }
    });
};


exports.listOf = function(req, res) {

    Saving.find( {

        user: req.params.userid }).sort('-created').exec(function(err, posts) {

    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    } else {
        //console.log(req.params.userid);
        res.jsonp(posts);
    }
});
};

/**
 * Count of Deals Today
 */
exports.countSavingsToday = function (req, res) {
    Saving.count({

        $where: function () {
            return Date.now() - this._id.getTimestamp() < (24 * 60 * 60 * 1000);
        }

        },

        function (err, savingsCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = savingsCount;
                res.jsonp(data);
            }
        });
};

/**
 * Update product picture
 */
exports.changeProductPictureSaving = function (req, res) {

    var user = req.user;
    var message = null;

    if (user) {
        fs.writeFile('./modules/savings/client/img/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
            if (uploadError) {
                return res.status(400).send({
                    message: 'Error occurred while uploading profile picture'
                });
            } else {

                user.imageURL = './modules/savings/client/img/uploads/' + req.files.file.name;

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
