const express = require('express');
const cors = require('cors');
const { debugController } = require("./APIs/debug");
const { homeController } = require("./APIs/home");
const { startChatServer } = require("./Chat/chatServer");
const routeConfig = require('./routeConfig');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(routeConfig.standardResponse());

routeConfig.registerRoutes(app, debugController);
routeConfig.registerRoutes(app, homeController);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
startChatServer();