'use strict';

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var csrf = require('csurf');
var session = require('express-session');

var Employee = require('./com/clearmarkets/model/employee-model');
var config = require('./com/clearmarkets/config/config');

var port = process.env.PORT || 9000;
var db = mongoose.connection;

mongoose.connect(config.database, function(err) {
  if (err) {
    throw err;
  }
  console.log("Successfully connected to database");
});
app.set('superSecret', config.secret);



app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
//app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev'));


// basic route
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});


var apiRoutes = express.Router();

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({
    message: 'Welcome to the coolest API on earth!'
  });
});

apiRoutes.get('/employees', function(req, res) {
  Employee.find(function(err, employees) {
    if (err)
      res.send(err);

    res.json(employees);
  });
});


function getNextEmployeeId(callback) {
  Employee.find(function(err, employees) {
    callback( employees[employees.length - 1].employeeId + 1 );
  });
}

apiRoutes.post('/add/employee', function(req, res) {

  getNextEmployeeId(function(result) {
    var employee = new Employee();
    employee.employeeId = result;
    console.log("Username" + req.body.employee.username + ", password : " + req.body.employee.password +
    ", firstName : " + req.body.employee.firstName + ", lastname : " + req.body.employee.lastName +
    ", designation : " + req.body.employee.designation + ", office Phone no: " + req.body.employee.officePhoneNo +
    ", officePhoneExt : " + req.body.employee.officePhoneExt + ", cellphone no: " + req.body.employee.cellPhoneNo +
    ", email : " + req.body.employee.email + ", admin: " + req.body.employee.admin
  );
    employee.employeeId = result;
    employee.username = req.body.employee.username;
    employee.password = req.body.employee.password;
    employee.firstName = req.body.employee.firstName;
    employee.lastName = req.body.employee.lastName;
    employee.designation = req.body.employee.designation;
    employee.officePhoneNo = req.body.employee.officePhoneNo;
    employee.officePhoneExt = req.body.employee.officePhoneExt;
    employee.cellPhoneNo = req.body.employee.cellPhoneNo;
    employee.email = req.body.employee.email;
    employee.admin = req.body.employee.admin;

    employee.location = req.body.employee.location;

    console.log("employeeId : " +employee.employeeId + ", username : " + employee.username + ", password : " + employee.password +
    ", firstName : " + employee.firstName + ", lastName : " + employee.lastName +
    ", designation : " + employee.designation + ", office Phone no: " + employee.officePhoneNo +
    ", officePhoneExt : " + employee.officePhoneExt + ", cellphone no: " + employee.cellPhoneNo +
    ", email : " + employee.email + ", admin: " + employee.admin + ", location : " + employee.location
  );
    employee.save(function(err) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.json({
        success: true,
        message: employee,
        token: token
      });
    });
  });

});

apiRoutes.delete('/delete/employee', function(req, res) {

  var id = req.body.employee._id;
  Employee.findByIdAndRemove(id, function(err) {
    if(err) {
      res.send(err);
      return;
    }

    res.json({ 'message' : 'Employee successfully deleted !!', 'success' : true });
  });
});

apiRoutes.post('/edit/employee', function(req, res) {
  console.log("Request from UI: Username" + req.body.employee.username + ", password : " + req.body.employee.password +
        ", firstName : " + req.body.employee.firstName + ", lastname : " + req.body.employee.lastName +
        ", designation : " + req.body.employee.designation + ", office Phone no: " + req.body.employee.officePhoneNo +
        ", officePhoneExt : " + req.body.employee.officePhoneExt + ", cellphone no: " + req.body.employee.cellPhoneNo +
        ", email : " + req.body.employee.email + ", admin: " + req.body.employee.admin
      );

      var id = req.body.employee._id;
      Employee.findByIdAndUpdate(id, {
        $set: {
          password : req.body.employee.password,
          designation : req.body.employee.designation,
          officePhoneNo : req.body.employee.officePhoneNo,
          officePhoneExt : req.body.employee.officePhoneExt,
          admin : req.body.employee.admin
        }
      }, function(err, employee) {
        if (err) {
          console.log(err);
          throw err;
        }
        res.send(employee);
      });
});

apiRoutes.post('/authenticate', function(req, res) {

  // find the employee
  Employee.findOne({
    username: req.body.username
  }, function(err, employee) {

    if (err) throw err;

    if (!employee) {
      res.json({
        success: false,
        message: 'Authentication failed. Employee not found.'
      });
    } else if (employee) {
      // check if password matches
      employee.comparePassword(req.body.password, function(err, isMatch) {
        if (err) {
          throw error;
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        }
        // if employee is found and password is right
        // create a token

				var token = jwt.sign(employee.username, app.get('superSecret'), {
					expiresInMinutes: 1440 // expires in 24 hours
				});




        var emp = employee;
        emp.password = '';
        res.json({
          success: true,
          message: emp,
          token: token
        });
      });
    }

  });
});

app.use('/api', apiRoutes);

app.get('/setup', function(req, res) {

  // create a sample user
  var shameer = new Employee({
    employeeId: 2,
    firstName: "Shameer",
    lastName: "Salim",
    username: "shameer",
    password: "password",
    designation: "Vice President",
    officePhoneNo: 7043501234,
    officePhoneExt: 1234,
    cellPhoneNo: 2019935204,
    email: "shameer@clear-markets.com",
    admin: true
  });

  // save the sample user
  shameer.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({
      success: true
    });
  });
});

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
