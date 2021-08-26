const express = require('express');
var cors = require('cors')

const app = express();


//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//routes
app.use(require('./routes/index'));

app.listen(3001);
console.log('Server on port 3001')