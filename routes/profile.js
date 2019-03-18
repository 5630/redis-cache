const express = require('express');
const router = express.Router();

router.get('/:name', (req, res) => {
    const key = req.params.name;

    req.cache.get(key, (err, data) => {
        if (err) {
            console.error(err);
            res.send(`error: ${err}`);
        }
        const ret = JSON.parse(data);
        res.status(200).json(ret);
    });
});

router.post('/', (req, res) => {
    const key = req.body.name;
    const value = JSON.stringify(req.body);

    req.cache.set(key, value, (err, data) => {
        if (err) {
            console.log(err);
            res.send(`error: ${err}`);
        }
        req.cache.expire(key, 10);
        res.json(value);
    });
});


module.exports = router;