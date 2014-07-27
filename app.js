var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  Person = require('./models/main.js').Person,
  path = require('path'),
  app = express();



app.set("view engine", "ejs");
// Middleware
app.use(bodyParser.urlencoded());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
  Person.all(function(err, allPeople) {
    res.render('people/index', {everyone: allPeople})
  })
})

app.get("/people", function(req, res) {
  Person.all(function(err, allPeople) {
    res.render("people/people", {everyone: allPeople})
  })
});

app.get("/people/new", function(req, res){
  res.render("people/new")
});

app.get("/people/:id", function(req,res){

  var index = req.query.id;

  Person.findBy('id', index, function(err, foundPerson) {
    res.render("people/show", {person: foundPerson});
  })
});

app.get("/people/:id/edit", function(req,res){
  Person.findBy('id', req.params.id, function(err, foundPerson) {
    res.render("people/edit", {person: foundPerson});
  })
});

app.post("/people", function(req, res){
  var person = req.body.person;
  Person.create(person, function(err, createdPerson) {
    res.redirect("/people")
  });
});

app.delete("/people/:id", function(req, res){
  var id = req.params.id;
  Person.findBy('id', id, function(err, returnPerson) {
    returnPerson.destroy();
  })
  res.redirect("/people");
});

app.put("/people/:id", function(req,res){
  var id = req.params.id
  var person = req.body.person;
  person.id = Number(id);
  Person.findBy('id', id, function(err, returnPerson) {
    returnPerson.update(person, function(err, person) {
    })
  })
  res.redirect("/people");
})

app.listen(3000, function(){
  console.log("THE SERVER IS LISTENING ON localhost:3000");
});
