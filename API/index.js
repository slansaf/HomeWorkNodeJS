const express = require('express');
const joi = require('joi');
const fs = require('fs');
const path = require('path');

const app = express();
const usersFilePath = path.join(__dirname, 'users.json');

// const users = [];

let uniqueID = 0;

const usersScherma = joi.object({
    firstName: joi.string().min(1).required(),
    secondName: joi.string().min(1).required(),
    age: joi.number().min(0).max(150).required(),
    city: joi.string().min(1)

});

app.use(express.json());

// Функция для чтения пользователей из файла
const readUsersFromFile = () => {
    if (!fs.existsSync(usersFilePath)) {
        return [];
    }
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
};

// Функция для записи пользователей в файл
const writeUsersToFile = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

app.get('/users', (req, res) => {
    const users = readUsersFromFile();
    res.send({users});
});

app.get('/users/:id', (req, res) => {
    const userId = +req.params.id;
    const users = readUsersFromFile();
    const user = users.find((user) => user.id === userId);
    if (user){
        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
});

app.post('/users', (req, res) => {
    const result = usersScherma.validate(req.body);

    if(result.error){
        return res.status(404).send({error: result.error.details});
    }

    const users = readUsersFromFile();

    uniqueID = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    const newUser = {
        id: uniqueID,
        ...req.body
    };
    users.push(newUser);
    writeUsersToFile(users);
    res.send({id: uniqueID});
});

app.put('/users/:id', (req, res) => {
    const result = usersScherma.validate(req.body);
    if(result.error){
        return res.status(404).send({error: result.error.details});
    }

    const userId = +req.params.id;
    const users = readUsersFromFile();
    const user = users.find((user) => user.id === userId);
    if (user){
        const{firstName, secondName, age, city} = req.body;
        user.firstName = firstName;
        user.secondName = secondName;
        user.age = age;
        user.city = city;
        writeUsersToFile(users);
        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
});

app.delete('/users/:id', (req, res) => {
    const userId = +req.params.id;
    const users = readUsersFromFile();
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1)[0];
        writeUsersToFile(users);
        res.send({ user: deletedUser });
    } else {
        res.status(404);
        res.send({user: null});
    }
});

app.listen(3000);