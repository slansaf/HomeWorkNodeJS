const handlebars = require('handlebars');

const tamplate = handlebars.compile(
    '{{#if bold}}  <b> Hello! </b> {{else}}  <p> Hello! </p> {{/if}}'
);

console.log(tamplate({bold: true}));
console.log(tamplate({bold: false}));

const express = require('express');
const joi = require('joi');

const app = express();

const users = [];

let uniqueID = 0;

const usersScherma = joi.object({
    firstName: joi.string().min(1).required(),
    secondName: joi.string().min(1).required(),
    age: joi.number().min(0).max(150).required(),
    city: joi.string().min(1)

});

app.use(express.json());

app.get('/users', (req, res) => {
    res.send({users});
});

app.get('/users/:id', (req, res) => {
    const userId = +req.params.id;
    const user = users.find((user) => user.id === userId);
    if (user){
        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
});

app.post('/users', (req, res) => {
    uniqueID += 1;
    users.push({
        id: uniqueID,
        ...req.body
    });
    res.send({id: uniqueID});
});

app.put('/users/:id', (req, res) => {
    const userId = +req.params.id;
    const user = users.find((user) => user.id === userId);
    if (user){
        const{firstName, secondName, age, city} = req.body;
        user.firstName = firstName;
        user.secondName = secondName;
        user.age = age;
        user.city = city;
        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
});

app.delete('/users/:id', (req, res) => {
    const userId = +req.params.id;
    const user = users.find((user) => user.id === userId);
    if (user){
        const userIndex = users.indexOf(user);
        users.splice(userIndex, 1);
        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
});

app.listen(3000);