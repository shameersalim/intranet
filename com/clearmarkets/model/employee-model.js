// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR =  10;

// set up a mongoose model and pass it using module.exports
var EmployeeSchema   = new Schema({
    employeeId : {type : Number, required : true, index : {unique : true}},
    firstName : {type : String, required : true},
    lastName : {type : String, required : true},
    username : {type : String, required : true},
    password: {type : String, required : true},
    location: {type : String, required : true},
    designation : {type : String, required : true},
    officePhoneNo : {type : Number, required : true},
    officePhoneExt : {type : Number, required : true},
    cellPhoneNo : {type : Number, required : true},
    email : {type : String, required : true},
    admin: {type : Boolean, default : false, required: false}
});


EmployeeSchema.pre('save', function(next) {
    var employee = this;

// only hash the password if it has been modified (or is new)
if (!employee.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(employee.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        employee.password = hash;
        next();
    });
});


});

EmployeeSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Employee', EmployeeSchema);
