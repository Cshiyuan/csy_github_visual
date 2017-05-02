var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {


    res.render('index', {
        title: 'Csy_Github_Visual'
    });
});


module.exports = router;
