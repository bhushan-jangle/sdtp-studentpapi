var express = require('express');
var router = express.Router();
var multer  =   require('multer');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var passport = require('passport');
var jwt = require('jsonwebtoken');

const User = require('../models/user');

var secret = '7x0jhxt&quot;9(thpX6';

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (request, file, callback) {

    callback(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
  }
});

/* In the below line you will have an array of photos files. request.files is an object where fieldname is the key and value is the array of files */

var upload = multer({storage: storage}).array('file', 5);



var url = 'mongodb://student:student@ds213259.mlab.com:13259/studentpdetail';

router.post('/student/details', function(req, res, next) {
  var item = {
    fullname: req.body.fullname,
    collegename: req.body.collegename,
    dateofbirth:req.body.dateofbirth,
    passtype:req.body.passtype,
    aadharno:req.body.aadharno,
    gender:req.body.gender,
    mobileno: req.body.mobileno,
    address: req.body.address
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });

  res.json({ msg : 'Data successfully inserted...'});
});


router.post('/student/documents',function(req,res){
    upload(req,res,function(err){
        if(err) {
           res.json({ msg : err});
        }
        else {
           res.json({ msg :'file uploaded successfully'});
        }
    });
});




//Registration Endpoint
router.post('/register', function (req, res) {
  User.register(new User({ email: req.body.email }), req.body.password, function (err, user) {
    if (err) {
      return res.status(400).send({ error: 'Email address in use.' })
    }
    res.status(200).send({ user: user.id });
  });
});

//Login Endpoint
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    if (user) {
      var token = jwt.sign({ id: user._id, email: user.email }, secret);
      return res
        .status(200)
        .json({ token });
    }
  })(req, res, next);
});

module.exports = router;
