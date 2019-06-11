class Route {
    constructor (method, path, callback) {
        this._method = method;
        this._path = path;
        this._callback = callback;
    }

    get method() { return this._method; }
    get path() { return this._path; }
    get callback() { return this._callback; }
}

class Api {
    constructor() {
        this._routes = [];
    }

    createRoute(method, path, callback) {
        this._routes.push(new Route(method, path, callback));
    }

    *getRoutes() {
        for (let route of this._routes) yield route;
    }
}

const httpMethods = {
    GET: 0,
    POST: 1
};

function standardResponse() {
    return function (req, res, next) {
        res.jsonSuccess = data => {
            res.json({
                success: true,
                message: "",
                data
            });
        };

        res.jsonFail = message => {
            res.json({
                success: false,
                message,
                data: null
            });
        };

        next();
    }
}

function registerRoutes(app, api) {
    for (let route of api.getRoutes()) {
        if (route.method === httpMethods.GET) {
            app.get(route.path, route.callback);
        }
        else {
            app.post(route.path, route.callback);
        }
    }
}

exports.Api = Api;
exports.httpMethods = httpMethods;
exports.registerRoutes = registerRoutes;
exports.standardResponse = standardResponse;