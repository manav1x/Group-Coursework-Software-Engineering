const express = require('express.js');

const port = 3000;
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.listen(port, () => {
    console.log('Server running on port ${port}');
});