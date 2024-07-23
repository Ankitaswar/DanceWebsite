
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/DanceContact')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Connection error', error);
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("We are connected");
});

var UserSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String
})

var User = mongoose.model('User', UserSchema);

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/static', express.static('static'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, resp)=>{
    const params = {}
    resp.status(200).render('home.pug', params);
})

app.get('/contact', (req, res)=>{
    const params = {}
    res.status(200).render('contact.pug', params);
})

app.post('/contact', (req, res)=>{
    var mydata = new User(req.body);

    mydata.save().then(()=>{
        res.send("This items has been saved to database");
    }).catch(()=>{
        res.status(400).send("Failed to save data into the database");
    })

    // resp.status(200).render('contact.pug');
})


app.listen(port, ()=>{
    console.log("This application stated successfully on port", port);
});