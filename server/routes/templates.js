/**
 * Created by nbhonsale on 3/5/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res, next) {
    req.db.Template.find(function(err, list) {
        if (err) {
            return next(err);
        }
        res.json(list);
    });
});

/* GET specific user. */
router.get('/:id', function(req, res, next) {

    // get the args
    var id = req.params.id;

    req.db.Template.find({_id: mongoose.Types.ObjectId(id)}, function(err, list) {
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

    var template = new req.db.Template(req.body);
    template._id = mongoose.Types.ObjectId();
    template.active = true;
    template.save(template, function(err) {
        if (err) next(err);
        res.json(template);
    });
});

router.put('/:id', function(req, res, next) {

    // get the args
    var id = req.params.id;

    req.db.Template.find({_id: id}, function (err, model) {
        if (model != undefined && model != null && model.length > 0 && model[0].active == 1) {
            var template = new req.db.Template(req.body);
            template._id = mongoose.Types.ObjectId(id);
            req.db.Template.update({_id: template._id}, template, function (err1, umodel) {
                if (err1) next(err1);
                res.json(template);
            });
        }
        else {
            res.sendStatus(404);
        }
    });
});

router.delete('/:id', function(req, res, next) {

    // get the args
    var id = req.params.id;
    req.db.Template.remove({_id: mongoose.Types.ObjectId(id)}, function(err) {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
});

module.exports = router;
