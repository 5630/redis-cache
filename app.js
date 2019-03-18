const express = require('express');
const morgan = require('morgan');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');

const profileRouter = require('./routes/profile');

const app = express();
app.set('port', process.env.PORT || 8080);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    req.cache = client;
    next();
});

app.use('/profile', profileRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 대기중`);
});