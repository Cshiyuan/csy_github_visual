var express = require('express');
var router = express.Router();


//mongodb
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://119.29.186.160:27017/github_info';

var selectData = function (db, whereStr, callback) {
    //连接到表
    var collection = db.collection('REPOS_TABLE');
    //查询数据
    // var whereStr = {"language": "C"};
    collection.find(whereStr).toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result.length);
    });
    // var count = collection.find(whereStr).count();
    // // var count = collection.find(whereStr).count();
    // callback(count);
};



// var
/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.send('respond with a resource');
    // selectData(db, function(result){
    //     console.log(result);
    //     db.close();
    // })

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        console.log("连接成功!");
        var resultC;
        var resultR;
        selectData(db, {"language": "C"}, function (result) {
            console.log(result);
            resultC = result;

        });
        selectData(db, {"language": "Ruby"}, function (result) {
            console.log(result);
            resultR = result;
        });



        db.close();
    });
});

module.exports = router;
