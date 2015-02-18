var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function (req, res) {
   res.sendFile(path.resolve(__dirname , '../views/index.html'));
});

router.get('/:name', function (req, res) {
    var fileName = req.params.name;
    res.sendFile(path.resolve(__dirname , '../views/' + fileName ) );
});

module.exports = router;