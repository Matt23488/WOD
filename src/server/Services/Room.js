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

    addClient(wsConnection) {
        let client = this.getClient(wsConnection.remoteAddress);
        if (client) return false;

        client = new Client(wsConnection);
        this._clients.push(client);
        return true;
    }

    updateClientName(clientIp, screenName) {
        let client = this.getClient(clientIp);
        if (!client) return false;

        client.screenName = screenName;
        this._clients.forEach(c => c._wsConnection.send(JSON.stringify({
            type: "connect",
            timestamp: Date.now(),
            message: `${screenName} has connected.`
        })));
        return true;
    }

    postMessage(text, clientIp) {
        const client = this.getClient(clientIp);
        if (!client || !client.screenName) return false;

        const message = new Message(text, client);
        this._messages.push(message);
        this._clients.forEach(c => c._wsConnection.send(JSON.stringify({
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
        this._clients.forEach(c => c._wsConnection.send(JSON.stringify({
            type: "disconnect",
            timestamp: Date.now(),
            message: `${client.screenName} has disconnected.`,
        })));
        return true;
    }
}

class Client {
    // TODO: Currently allowing multiple clients to have the same screen name.
    constructor(wsConnection) {
        this._wsConnection = wsConnection;
    }

    get ipAddress() { return this._wsConnection.remoteAddress; }
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

exports.room = new Room();