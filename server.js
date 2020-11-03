const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routers/userRoute');

const port = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(cors());
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

mongoose.connect('mongodb://localhost/money-management-app', {useNewUrlParser: true}, () => {
    console.log('Database connected');
});

app.use('/api/user', userRoute);

app.get('/', (req,res) => {
    res.json(
        {
            message: 'Welcome to our application'
        });
});

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});