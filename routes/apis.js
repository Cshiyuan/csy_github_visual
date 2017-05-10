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

var userSchema = new mongoose.Schema({

    "username": {type: String},
    "public_repos": {type: Number},
    "public_gists": {type: Number},
    "created_at": {type: String},
    "updated_at": {type: String},
    "homepage_url": {type: String},
    "repos_url": {type: String},
    "location": {type: String},
    "following": {type: Number},
    "followers": {type: Number},
    "id": {type: Number}

}, {collection: "USER_TABLE"});


var reposModel = db.model("REPOS_TABLE", reposSchema);  //生成ReposModel
var userModel = db.model("USER_TABLE", userSchema);     //生成UserModel


// reposModel.where({'language': 'C'}).count(function (err, count) {
//     // if (err) return handleError(err);
//     console.log('there are %d C language', count);
// });
// reposModel.where({'language': 'Ruby'}).count(function (err, count) {
//
//     console.log('there are %d Ruby language', count);
// });
var checkUserUpdateTime = function (callback) {

    userModel.aggregate().group({"_id": "$updated_at", "count": {$sum: 1}}).exec(function (err, res) {

        resultMap = new Map();
        for (var i = 0; i < res.length; i++) {
            var key = res[i]._id.substr(0, 10).replace(/-/g, '/');
            // console.log(key);
            var value = resultMap.get(key);
            if (value) {  //已经存在
                value++;
                resultMap.set(key, value);
            } else {
                value = 1;
                resultMap.set(key, value);
            }
        }

        // console.log(resultMap);
        callback(resultMap);
    });
};


var checkUserRegTime = function (callback) {

    userModel.aggregate().group({"_id": "$created_at", "count": {$sum: 1}}).exec(function (err, res) {

        resultMap = new Map();
        for (var i = 0; i < res.length; i++) {
            var key = res[i]._id.substr(0, 10).replace(/-/g, '/');
            // console.log(key);
            var value = resultMap.get(key);
            if (value) {  //已经存在
                value++;
                resultMap.set(key, value);
            } else {
                value = 1;
                resultMap.set(key, value);
            }
        }

        // console.log(resultMap);
        callback(resultMap);
    });
};

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


var checkUserFollowingWithCount = function (num, callback) {
    userModel.where({'following': {$gt: num}}).count(function (err, count) {

        callback(num, count);
    });
};


var checkUserFollowerWithCount = function (num, callback) {
    userModel.where({'followers': {$gt: num}}).count(function (err, count) {

        callback(num, count);
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

var mapToArray = function MapToArray(Map, checkKey) {
    var arr = [];
    Map.forEach(function (value, key, map) {

        var obj = {};
        obj.value = value;
        obj.name = checkKey(key);
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
                res.json(mapToArray(mapModel, function (key) {
                    // '库的watcher大于'
                    return '库的watcher大于' + key;
                }));
            }
        });
    }
});

router.get('/checkUserFollowerWithCount', function (req, res) {
    var mapModel = new Map();
    for (var i = 0; i < 10; i++) {
        checkReposWatchersWithCount(i * 10, function (num, count) {

            mapModel.set(num, count);
            // console.log('there are %d watchers', count);
            if (num >= 90) {
                res.json(mapToArray(mapModel, function (key) {
                    // '库的watcher大于'
                    return 'Follower数量大于' + key;
                }));
            }
        });
    }
});

router.get('/checkUserFollowingWithCount', function (req, res) {
    var mapModel = new Map();
    for (var i = 0; i < 10; i++) {
        checkUserFollowingWithCount(i * 10, function (num, count) {

            mapModel.set(num, count);
            // console.log('there are %d watchers', count);
            if (num >= 90) {
                res.json(mapToArray(mapModel, function (key) {
                    // '库的watcher大于'
                    return 'Following数量大于' + key;
                }));
            }
        });
    }
});


router.get('/checkReposLanguageWithCount', function (req, res) {

    checkReposLanguageWithCount(function (result) {
        res.json(result);
    });
});

router.get('/checkUserRegTime', function (req, res) {

    checkUserRegTime(function (result) {
        res.json(mapToArray(result, function (key) {
            return key;
        }));
    });
});


router.get('/checkUserUpdateTime', function (req, res) {
    checkUserUpdateTime(function (result) {
        res.json(mapToArray(result, function (key) {
            return key;
        }))
    })
});

module.exports = router;