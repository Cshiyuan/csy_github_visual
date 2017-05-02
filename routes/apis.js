/**
 * Created by chenshyiuan on 2017/5/2.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');    //引用mongoose模块
var db = mongoose.createConnection('119.29.186.160', 'github_info'); //创建一个数据库连接

db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
    //一次打开记录
    console.log("连接成功!");
});

var reposSchema = new mongoose.Schema({   //Schema框架

    "watchers": {type: Number},
    "name": {type: String},
    "language": {type: String},
    "created_at": {type: String},
    "updated_at": {type: String},
    "id": {type: Number},
    "pushed_at": {type: String},
    "full_name": {type: String},
    "stargazers_count": {type: Number},
    "size": {type: Number},
    "forks": {type: Number},
    "owner_id": {type: Number}
}, {collection: "REPOS_TABLE"});


var reposModel = db.model("REPOS_TABLE", reposSchema);  //生成Model


// reposModel.where({'language': 'C'}).count(function (err, count) {
//     // if (err) return handleError(err);
//     console.log('there are %d C language', count);
// });
// reposModel.where({'language': 'Ruby'}).count(function (err, count) {
//
//     console.log('there are %d Ruby language', count);
// });

var checkReposWatchersWithCount = function (num, callback) {

    reposModel.where({'watchers': {$gt: num}}).count(function (err, count) {


        callback(num, count);
    });
};

var checkReposLanguageWithCount = function (callback) {
    reposModel.aggregate().group({"_id": "$language", "count": {$sum: 1}}).exec(function (err, res) {
        // console.log(res);
        callback(res);
    });
};

var mapToObj = function MapToObj(Map) {
    var obj = {};
    Map.forEach(function (value, key, map) {
        // console.log("参数1="+value+",参数2="+key);
        obj[key] = value;
    });
    return obj;
};

var mapToArray = function MapToArray(Map) {
    var arr = [];
    Map.forEach(function (value, key, map) {

        var obj = {};
        obj.value = value;
        obj.name = '库的watcher大于' + key;
        arr.push(obj);
    });

    return arr;

};


router.get('/checkReposWatchersWithCount', function (req, res) {

    var mapModel = new Map();
    for (var i = 0; i < 10; i++) {
        checkReposWatchersWithCount(i * 10, function (num, count) {

            mapModel.set(num, count);
            // console.log('there are %d watchers', count);
            if (num >= 90) {
                res.json(mapToArray(mapModel));
            }
        });
    }
});


router.get('/checkReposLanguageWithCount', function (req, res) {

    checkReposLanguageWithCount(function (result) {
        res.json(result);
    });
});

module.exports = router;