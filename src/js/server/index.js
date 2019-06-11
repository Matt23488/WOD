// import Room from "./Room"; // TODO: Will have to use TypeScript for this. Going to just put it in this file until then

const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(express.json());
app.use(cors());

const rooms = [];

app.post('/CreateRoom', (req, res) => {
    const { name, password } = req.body;
    if (rooms.some(room => room.name === name)) {
        res.json({
            success: false,
            message: "Room with that name already exists!"
        });
        return;
    }

    const newRoom = new Room(name, password);
    rooms.push(newRoom);
    const client = newRoom.accept(req.ip, password);
    res.json({
        success: true,
        token: client.token
    });
});

app.post('/JoinRoom', (req, res) => {
    const { name, password } = req.body;
    const room = rooms.filter(room => room.name === name)[0];
    if (!room) {
        res.json({
            success: false,
            message: `No room with name"${name}" found!`
        });
        return;
    }

    const client = room.accept(req.ip, password);
    if (!client) {
        res.json({
            success: false,
            message: `Incorrect password provided for room "${name}"!`
        });
        return;
    }

    res.json({
        success: true,
        token: client.token
    });
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
        
        const client = new Client(ipAddress, this._currentToken);
        this._clients.push(client);
        this._currentToken++;
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