const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config();
const moment = require('moment-timezone')

app.use(cors())

const addressRoute = require('./database/Router/addressRoute.js')
const userRoute = require('./database/Router/userRoute.js')
const planRoute = require('./database/Router/planRoute.js')
const healthStatusRoute = require('./database/Router/healthStatusRoute.js')
const enrollRoute = require('./database/Router/enrollRoute.js')
const adminRoute = require('./database/Router/adminRoute.js')
const apiRoute = require('./database/Router/apiRoutes.js')
const searchRoute = require('./database/Router/searchRoute.js')

const path = require('path');

app.use(express.json());

app.use('/address',addressRoute);
app.use('/user',userRoute);
app.use('/plan',planRoute);
app.use('/healthStatus',healthStatusRoute);
app.use('/enroll',enrollRoute);
app.use('/admin',adminRoute)
app.use('/api',apiRoute);
app.use('/search',searchRoute)

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'final.html'));
});

app.use((err,req,res,next) => {
    console.log(err.stack);
    res.status(500).send('server error!!!');
})

app.all('*',(req,res) => {
    res.status(404).send('<h1>Page Not Found</h1>')
})

if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, (err) => {
        if (err) console.error(err);
        console.log("Server is listening at port: " + PORT);
    });
}

module.exports = app;