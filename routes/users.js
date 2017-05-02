var express = require('express');
var router = express.Router();


//mongodb
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://119.29.186.160:27017/github_info';

var selectData = function (db, whereStr, callback) {
    //连接到表
    var collection = db.collection('REPOS_TABLE');
    //查询数据
    var count = collection.find(whereStr).count();
    callback(count);
};
var aggregateLanguageCount = function (db, callback) {

    db.collection('REPOS_TABLE').aggregate(
        [
            {$group: {"_id": "$language", "count": {$sum: 1}}}
        ]).toArray(function (err, result) {

        callback(result);
    });
};


// var
/* GET users listing. */
router.get('/', function (req, res, next) {

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        console.log("连接成功!");

        aggregateLanguageCount(db, function (result) {
            console.log(result);
            // result = result;
            var myLanguageName = [];
            var myLanguageCount = [];
            for (i = 0; i < result.length; i++) {
                myLanguageName.push("\'" + result[i]._id + "\'");
                myLanguageCount.push(result[i].count);
            }
            res.render('users', {
                title: 'Csy_Github_Visual',
                'myLanguageName': myLanguageName,
                "myLanguageCount": myLanguageCount
            });
        });


        db.close();
    });
});

module.exports = router;
