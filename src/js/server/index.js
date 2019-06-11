// import Room from "./Room"; // TODO: Will have to use TypeScript for this. Going to just put it in this file until then

const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(express.json());
app.use(cors());

const rooms = [];

// app.get('/', (req, res) => res.send("Hello World!"));
app.post('/CreateRoom', (req, res) => {
    console.log(req.body);
    const newRoom = new Room(req.body.name, req.body.password);
    rooms.push(newRoom);
    const client = newRoom.accept(req.ip, req.body.password);
    console.log("ROOMS:");
    for (let room of rooms) {
        console.log(room.name, room.password);
        for (let client of room.getClients()) {
            console.log(client);
        }
    }
    res.json({ token: client.token });
    // res.end();
});

app.post('/JoinRoom', (req, res) => {
    res.end();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

class Room {
    constructor(name, password) {
        this._name = name;
        this._password = password;
        this._clients = [];
        this._currentToken = 0; // TODO: Replace this with something more robust in the end lol
    }

    get name() { return this._name; }
    get password() { return this._password; }
    
    *getClients() {
        for (let client of this._clients) yield client;
    }

    getClient(ipAddress) {
        for (let client of this._clients) {
            if (client.ipAddress === ipAddress) {
                return client;
            }
        }
    }

    accept(ipAddress, password) {
        if (password !== this._password) return;
        
        const client = new Client(ipAddress, this._token);
        this._clients.push(client);
        this._token++;
        return client;
    }
};

class Client {
    constructor(ipAddress, token) {
        this._ipAddress = ipAddress;
        this._token = token;
    }

    get ipAddress() { return this._ipAddress; }
    get token() { return this._token; }
}