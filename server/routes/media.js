/**
 * Created by nbhonsale on 3/5/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function (req, res, next) {
    var name = req.query.name;
    var page = req.query.page;
    var take = req.query.take;
    console.log('name: ' + name + ' page:' + page + 'take: ' + take);
    if (page == undefined || page == null)
        page = 1;
    if (take == undefined || take == null)
        take = 10;
    var limit = page * take;
    if (name != undefined && name != null) {
        req.db.Media.find({title: new RegExp(name, "i")}).sort({updated: -1}).limit(limit).exec(function (err, list1) {
            if (err) {
                return next(err);
            }
            req.db.Media.find({tags: new RegExp(name, "i")}).sort({updated: -1}).limit(limit).exec(function (err, list2) {
                if (err) {
                    return next(err);
                }
                if (list1 === undefined)
                    res.json(list2);
                else if (list2 === undefined)
                    res.json(list1);
                else res.json(list2.concat(list1));
            });
        });
    }
    else
        {
            req.db.Media
                .find()
                .sort({updated: -1})
                .exec(function (err, list) {
                if (err) {
                    return next(err);
                }
                res.json(list);
            });
        }
    }
    );

/* GET specific media. */
router.get('/:id', function (req, res, next) {

    // get the args
    var id = req.params.id;

    req.db.Media.find({_id: id})
        .populate('comments.by')
        .exec(function (err, list) {
        if (err) {
            return next(err);
        }
        if (list != undefined && list != null && list.length > 0)
            res.json(list[0]);
        else
            res.json(null);
    });
});

router.post('/', function (req, res, next) {

    var media = new req.db.Media(req.body);
    media._id = mongoose.Types.ObjectId();
    media.active = true;
    media.save(media, function (err) {
        if (err) next(err);
        res.json(media);
    });
});

router.put('/:id', function (req, res, next) {

    // get the args
    var id = req.params.id;

    req.db.Media.find({_id: id}, function (err, model) {
        if (model != undefined && model != null && model.length > 0 && model[0].active == 1) {
            var media = new req.db.Media(req.body);
            media._id = mongoose.Types.ObjectId(id);
            req.db.Media.update({_id: media._id}, media, function (err1, umodel) {
                if (err1) next(err1);
                req.db.Media.find({_id: id})
                    .populate('comments.by')
                    .exec(function (err, list) {
                        if (err) {
                            return next(err);
                        }
                        if (list != undefined && list != null && list.length > 0)
                            res.json(list[0]);
                        else
                            res.json(null);
                    });
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});

router.delete('/:id', function (req, res, next) {

    // get the args
    var id = req.params.id;
    req.db.Media.remove({_id: mongoose.Types.ObjectId(id)}, function (err) {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
});

module.exports = router;
