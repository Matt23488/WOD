const { Api, httpMethods } = require("../routeConfig");

class HomeApi extends Api {
    constructor() {
        super();

        this.createRoute(httpMethods.GET, "/", (req, res) => {
            res.send("If you can see this, the server should be running okay.");
        });
    }
}

exports.homeController = new HomeApi();