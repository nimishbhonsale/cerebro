/**
 * Created by nbhonsale on 3/5/16.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require("util");

router.post('/', function (req, res, next) {
        console.log(req.file);
        res.json({filename: req.file.filename, type: req.file.mimetype});
});

router.get('/:id',function(req,res){
    var id = req.params.id;
    // todo: remove server hardcoding to config
    var filePath = "http://www.localhost:3000/artifacts/" + id;
    console.log("File path: " + filePath);
    res.json({uri: filePath});
});

module.exports = router;