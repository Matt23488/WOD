const express = require('express');
const cors = require('cors');
const api = require("./api");
const routeConfig = require('./routeConfig');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(api.standardResponse());

routeConfig.registerRoutes(app, api.getController());
app.listen(port, () => console.log(`Example app listening on port ${port}!`));