const express = require('express');
const cors = require('cors');
const { wodController } = require("./APIs/api");
const { debugController } = require("./APIs/debug");
const routeConfig = require('./routeConfig');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(routeConfig.standardResponse());

routeConfig.registerRoutes(app, wodController);
routeConfig.registerRoutes(app, debugController);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));