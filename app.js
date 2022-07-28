var express = require('express');

var app = express();
var PORT = 3001;

const { collectDefaultMetrics, register } = require('prom-client');
const { Counter } = require('prom-client');

collectDefaultMetrics({
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
});

const requests = new Counter({
    name: 'requests',
    help: 'count 200s and 500s',
    labelNames: ['statusCode'],
})

// const c500 = new Counter({
//     name: 'c500',
//     help: 'count 500s'
// })

app.get('/', function(req, res) {
    res.status(200).send('Hello world');
    requests.inc({statusCode: 200})
});

app.get('/error', function(req, res) {
    res.status(500).send('This webpage returns a 500 status!');
    requests.inc({statusCode: 500})
});

app.get('/metrics', function(req, res) {
    res.set('Content-Type', register.contentType)
    register.metrics().then(str => res.status(200).end(str))
});

app.listen(PORT, function() {
    console.log('Server is running on PORT:',PORT);
});

