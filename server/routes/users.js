var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var name = req.query.name;
    var username = req.query.username;
    var page = req.query.page;
    var take = req.query.take;

    if(page == undefined || page == null)
        page = 1;
    if(take == undefined || take == null)
        take = 10;
    var limit = page * take;
    if(name != undefined && name != null)
    {
        req.db.User.find({name:new RegExp(name, "i")}).limit(limit).exec(function (err, list) {
            if (err) {
                return next(err);
            }
            res.json(list);
        });
    }
    else {

        if (username != undefined && username != null) {
            req.db.User.find({username: new RegExp(username, "i")}).limit(limit).exec(function (err, list) {
                if (err) {
                    return next(err);
                }
                res.json(list);
            });
        }
        else {
            req.db.User.find(function (err, list) {
                if (err) {
                    return next(err);
                }
                res.header("Access-Control-Allow-Origin", "*");
                res.json(list);
            });
        }
    }
});

/* GET specific user. */
router.get('/:id', function(req, res, next) {
    // get the args
    var id = req.params.id;
    res.header("Access-Control-Allow-Origin", "*");

    req.db.User.find({_id: mongoose.Types.ObjectId(id)}, function(err, list) {

        if (err) {
            return next(err);
        }
        if(list != undefined && list != null && list.count > 0)
            res.json(list[0]);
        else
            res.json('');
    });
});

router.post('/', function(req, res, next) {

    var user = new req.db.User(req.body);
    user._id = mongoose.Types.ObjectId();
    user.active = true;
    user.save(user, function(err) {
        if (err) next(err);
        res.header("Access-Control-Allow-Origin", "*");
        res.json(user);
    });
});

router.put('/:id', function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    // get the args
    var id = req.params.id;

    req.db.User.find({_id: id}, function (err, model) {
        if (model != undefined && model != null && model.length > 0 && model[0].active == 1) {
            var user = new req.db.User(req.body);
            user._id = mongoose.Types.ObjectId(id);
            req.db.User.update({_id: user._id}, user, function (err1, umodel) {
                if (err1) next(err1);
                res.json(user);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});

router.delete('/:id', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

    // get the args
    var id = req.params.id;
    req.db.User.remove({_id: mongoose.Types.ObjectId(id)}, function(err) {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
});

module.exports = router;
