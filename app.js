var express = require('express');

var app = express();
var PORT = 3001;

const { register } = require('prom-client');
const { Counter } = require('prom-client');
const { machineIdSync } = require('node-machine-id')

const requests = new Counter({
    name: 'requests',
    help: 'count 200s, 300s and 500s',
    labelNames: ['statusCode', 'machineID'],
})

const mid = machineIdSync()

app.get('/', function(req, res) {
    res.status(200).send('Hello world');
    requests.inc({statusCode: 200, machineID: mid})
});

app.get('/error', function(req, res) {
    res.status(500).send('This webpage returns a 500 status!');
    requests.inc({statusCode: 500, machineID: mid})
});

app.get('/metrics', function(req, res) {
    res.set('Content-Type', register.contentType)
    register.metrics().then(str => res.status(200).end(str))
});

app.listen(PORT, function() {
    console.log('Server is running on PORT:',PORT);
});

