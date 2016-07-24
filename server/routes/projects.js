/**
 * Created by nbhonsale on 3/5/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET project listing. */
router.get('/', function(req, res, next) {
    var name = req.query.name;
    var page = req.query.page;
    var take = req.query.take;

    if(page == undefined || page == null)
        page = 1;
    if(take == undefined || take == null)
        take = 10;
    var limit = page * take;
    if(name != undefined && name != null)
    {
        req.db.Project.find({name:new RegExp(name, "i")}).sort({updated: -1}).limit(limit).exec(function (err, list) {
            if (err) {
                return next(err);
            }
            res.json(list);
        });
    }
    else {
        req.db.Project
            .find()
            .sort({updated: -1})
            .exec(function (err, list) {
            if (err) {
                return next(err);
            }
            res.json(list);
        });
    }
});

/* GET specific project. */
router.get('/:id', function(req, res, next) {

    // get the args
    var id = req.params.id;
    console.log("Id: " + id);

    req.db.Project.find({_id: id})
        .populate('template')
        .populate('owner')
        .populate('creator')
        .populate('stakeholders')
        .populate('milestones.sign_off.by')
        .populate('milestones.media')
        .exec(function(err, list){
            if (err) {
            return next(err);
        }
        console.log("Output: " + JSON.stringify(list));
        if(list !== undefined && list !== null && list.length > 0)
            res.json(list[0]);
        else
            res.json(null);
    });
});

router.post('/', function(req, res, next) {

    var project = new req.db.Project(req.body);
    project._id = mongoose.Types.ObjectId();
    project.active = true;
    project.save(project, function(err) {
        res.header("Access-Control-Allow-Origin", "*");
        if (err) next(err);
        res.json(project);
    });
});

router.put('/:id', function(req, res, next) {

    // get the args
    var id = req.params.id;

    console.log('Request to update ..' + JSON.stringify(req.body));
    req.db.Project.find({_id: id}, function (err, model) {
        console.log('Projects fetched: ' + JSON.stringify(model));
        if (model != undefined && model != null && model.length > 0 && model[0].active == true) {
            var project = new req.db.Project(req.body);
            //project._id = mongoose.Types.ObjectId(id);
            req.db.Project.update({_id: id}, project, function (err1, umodel) {
                if (err1) next(err1);
                console.log('After update:' + JSON.stringify(umodel));
                req.db.Project.find({_id: id})
                    .populate('template')
                    .populate('owner')
                    .populate('creator')
                    .populate('stakeholders')
                    .populate('milestones.sign_off.by')
                    .populate('milestones.media')
                    .exec(function (err, list) {
                        if (err) {
                            return next(err);
                        }
                        console.log("Output: " + JSON.stringify(list));
                        if (list !== undefined && list !== null && list.length > 0)
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

router.delete('/:id', function(req, res, next) {
    // get the args
    var id = req.params.id;
    req.db.Project.remove({_id: mongoose.Types.ObjectId(id)}, function(err) {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
});

module.exports = router;
