/**
 * Created by chenshyiuan on 2017/5/2.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    res.render('github_visual', {
        title: 'Csy_Github_Visual'
    });
});

module.exports = router;