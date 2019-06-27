class Room {
    constructor() {
        this._clients = [];
        this._messages = [];
    }
    
    *getClients() {
        for (let client of this._clients) yield client;
    }

    *getMessages(timestamp = 0) {
        for (let message of this._messages) {
            if (message.timestamp > timestamp) yield message;
        }
    }

    getClient(ipAddress) {
        for (let client of this._clients) {
            if (client.ipAddress === ipAddress) {
                return client;
            }
        }
    }

    // TODO: Going to abstract the the ipAddress into this class, so
    // remove the `clientIp` parameter when I do so. Also look into
    // sending ids to clients rather the the IPs of other users.
    addClient(wsConnection, clientIp) {
        let client = this.getClient(clientIp || wsConnection.remoteAddress);
        if (client) return false;

        client = new Client(wsConnection, clientIp);
        this._clients.push(client);
        return true;
    }

    updateClientName(clientIp, screenName) {
        let client = this.getClient(clientIp);
        if (!client) return false;

        client.screenName = screenName;
        this._clients.forEach(c => c.wsConnection.send(JSON.stringify({
            type: "connect",
            timestamp: Date.now(),
            message: `${screenName} has connected.`
        })));
        return true;
    }

    // room.propagateNewClient(connection.remoteAddress);
    propagateNewClient(clientIp) {
        let client = this.getClient(clientIp);
        if (!client) return false;

        const otherClients = this._clients.filter(c => c.ipAddress !== clientIp);
        client.wsConnection.send(JSON.stringify(new WSMessage("init", {
                otherUsers: otherClients.map(({ ipAddress, screenName }) => { return { ipAddress, screenName }; })
        })));
        const newUserMessage = JSON.stringify(new WSMessage("newUser", { ipAddress: client.ipAddress, screenName: client.screenName }));
        otherClients.forEach(c => c.wsConnection.send(newUserMessage));
        return true;
    }

    postMessage(text, clientIp) {
        const client = this.getClient(clientIp);
        if (!client || !client.screenName) return false;

        const message = new Message(text, client);
        this._messages.push(message);
        this._clients.forEach(c => c.wsConnection.send(JSON.stringify({
            type: "message",
            timestamp: message.timestamp,
            message: message.messageText,
            screenName: client.screenName
        })));
        return true;
    }

    removeclient(clientIp) {
        const client = this.getClient(clientIp);
        if (!client) return false;

        this._clients = this._clients.filter(c => c.ipAddress !== clientIp);
        this._clients.forEach(c => c.wsConnection.send(JSON.stringify({
            type: "disconnect",
            timestamp: Date.now(),
            message: `${client.screenName} has disconnected.`,
        })));
        return true;
    }
}

class Client {
    // TODO: Currently allowing multiple clients to have the same screen name.
    constructor(wsConnection, clientIp) {
        this._wsConnection = wsConnection;
        this._clientIp = clientIp;
    }

    get wsConnection() { return this._wsConnection; }
    get ipAddress() { return this._clientIp || this._wsConnection.remoteAddress; }
    get screenName() { return this._screenName; }
    set screenName(value) { this._screenName = value; }
}

class Message {
    constructor(messageText, client) {
        this._messageText = messageText;
        this._timestamp = Date.now();
        this._client = client;
    }

    get messageText() { return this._messageText; }
    get timestamp() { return this._timestamp; }
    get client() { return this._client; }
}

class WSMessage {
    constructor(type, messageData) {
        this.type = type;
        this.timestamp = Date.now();
        this.message = messageData
    }
}

exports.room = new Room();