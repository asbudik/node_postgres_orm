var db = require('./db');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function Person(params) {
  this.firstname = params.firstname;
  this.lastname = params.lastname;
  this.phonenumber = "(" + getRandomInt(100, 999) + ") " + getRandomInt(100, 999) + " - " + getRandomInt(1000, 9999)
  this.id = params.id;
};

Person.all = function(callback){
  db.query('SELECT * FROM people', [], function(err, res){
    if (err) {
      console.log("something went wrong", err);
    }
    var allPeople = [];
    // do something here with res
    res.rows.forEach(function(params) {
      allPeople.push(new Person(params));
    })
    callback(err, allPeople);
  });
};

// Person.all(function(err, allPeopleArray) {
//   console.log(allPeopleArray);
//   // res.render(page), {allPeopleArray }
// });


Person.findBy = function(key, val, callback) {
  db.query('SELECT * FROM people WHERE ' + key + '=$1', [val], function(err, res){
    if (err) {
      console.log("something went wrong", err);
    }
    if (res.rows.length > 0) {
      var foundRow = res.rows[0];
      var foundPerson = new Person(foundRow);
    }
    callback(err, foundPerson);
  });
};

// Person.findBy('firstname', 'Jill', function(err, returnPerson) {
//   console.log(returnPerson);
// })


Person.create = function(params, callback){
  db.query('INSERT INTO people (firstname, lastname) VALUES ($1, $2) RETURNING *', [params.firstname, params.lastname], function(err, res){
    if (err) {
      console.log("something went wrong", err);
    }
    var createdRow = res.rows[0];
    var newPerson = new Person(createdRow);
    callback(err, newPerson);
  });
};

// Person.create({firstname: 'Sarah', lastname: 'Monte'}, function(err, createdPerson) {
//   console.log(createdPerson);
// });

Person.prototype.update = function(params, callback) {
  var colNames = [];
  var colVals = [];
  var count = 2;

  for(var key in this) {
    if(this.hasOwnProperty(key) && params[key] !== undefined){
      var colName = key + "=$" + count;
      colNames.push(colName);
      colVals.push(params[key]);
      count++;
    }
  }

  var statement = "UPDATE people SET " + colNames.join(", ") + " WHERE id=$1 RETURNING *";
  var values = [this.id].concat(colVals);
  console.log("Running:");
  console.log(statement, "with values", values);
  var _this = this;
  db.query(statement, values, function(err, res) {
    var updatedRow;
    if(err) {
      console.error("OOP! Something went wrong!", err);
    } else {
      updatedRow = res.rows[0];
      _this.firstname = updatedRow.firstname;
      _this.lastname = updatedRow.lastname;
    }
    callback(err, _this)
  });
}

Person.prototype.destroy = function(){
  db.query("DELETE FROM people WHERE id=$1", [this.id], function(err, res) {
    if (err) {
      console.log("something went wrong", err);
    }
  });
}

// Person.findBy('id', 16, function(err, returnPerson) {
//   returnPerson.destroy();
// })

module.exports = Person;
