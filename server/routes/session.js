/**
 * Created by nbhonsale on 3/5/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET session listing. */
router.get('/', function(req, res, next) {
    req.db.Session.find(function(err, list) {
        if (err) {
            return next(err);
        }
        res.json(list);
    });
});

/* CREATE a session. */
router.post('/', function(req, res, next) {

    console.log('inside session post');
    // get the args
    var user = req.body;
    console.log("User: " +  JSON.stringify(user));

    req.db.User.find({username: user.username, password: user.password})
        .exec(function(err, users) {
            if (err) {
                return next(err);
            }
            console.log("Users returned : " + JSON.stringify(users));
            if (users.length == 1) {
                req.db.Session.remove({username: user.username}, function(err) {
                    if (err) {
                        return next(err);
                    }

                    var session = new req.db.Session();
                    session._id = mongoose.Types.ObjectId();
                    session.username = user.username;
                    session.save(session, function (err) {
                        if (err) {
                            return next(err);
                        }

                        req.db.Session.find({username: user.username}).exec(function (err, sessionUser) {
                            if (err) {
                                return next(err);
                            }
                            console.log("Session User: " + JSON.stringify(sessionUser));
                            if (sessionUser !== undefined && sessionUser !== null && sessionUser.length > 0) {
                                res.json(sessionUser[0]);
                            }
                            else
                                res.json(null);
                        });
                    });
                });
            }
            else
                res.sendStatus(404);
        });
});

router.delete('/:id', function(req, res, next) {

    // get the args
    var username = req.params.id;
    req.db.Session.remove({username: username}, function(err) {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
});

module.exports = router;
