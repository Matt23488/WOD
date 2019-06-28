import Character from "./Character/Character";

export default class Connection {
    private _character: Character;
    private _connection: WebSocket;
    private _clientId: number;
    
    public serverAddress: KnockoutObservable<string>;
    public connected: KnockoutObservable<boolean>;
    public users: KnockoutObservableArray<{ id: number, screenName: string }>;
    public chatWindows: KnockoutObservableArray<ChatWindow>;
    public connectButtonText: KnockoutComputed<string>;

    public constructor(character: Character, serverAddress: string) {
        this._character = character;
        
        this.serverAddress = ko.observable(serverAddress);
        this.connected = ko.observable(false);
        this.users = ko.observableArray([]);
        this.chatWindows = ko.observableArray([]);
        this.connectButtonText = ko.computed(() => this.connected() ? "Disconnect" : "Connect", this);

        WebsocketSetup.Setup();
    }

    public connect(): void {
        if (this.connected()) return;
        this._connection = new WebSocket(`ws://${this.serverAddress()}:3001`);

        this._connection.addEventListener("open", () => {
            this.connected(true);
            this._connection.send(JSON.stringify({
                type: "init",
                value: {
                    name: this._character.name(),
                    utc42069: Date.UTC(69, 4, 20)
                }
            }));
        });

        this._connection.addEventListener("error", error => {
            // TODO: Display to the user
            console.error("Could not connect to the chat server.");
        });

        this._connection.addEventListener("message", message => {
            try {
                const json = JSON.parse(message.data);
                if (json.type === "info") {
                    for (let window of this.chatWindows()) {
                        if (!json.message.rooms.some((r: number) => r === window.id)) continue;
                        window.messages.push(new SimpleMessage(json.message.messageText));
                    }
                }
                else if (json.type === "init") {
                    this._clientId = json.message.id;
                    this.users.push(...json.message.users);
                    this.chatWindows.push(new ChatWindow(json.message.rooms[0]));
                }
                else if (json.type === "newUser") {
                    this.users.push(json.message);
                }
                else if (json.type === "message") {
                    for (let window of this.chatWindows()) {
                        if (window.id !== json.message.roomId) continue;
                        window.messages.push(new UserMessage(this.getUserScreenName(json.message.id), json.message.messageText, json.timestamp));
                    }
                }
                else if (json.type === "disconnect") {
                    const oldUser = this.users().filter(u => u.id === json.message)[0];
                    this.users.remove(oldUser);
                }
                else if (json.type === "error") {
                    console.log(json.message);
                }
            }
            catch (e) {
                console.error(`Message format unexpected: ${message.data}`);
            }
        });
    }

    public disconnect(): void {
        if (!this.connected()) return;

        this._connection.close();
        this.connected(false);
        this._connection = null;
        this.users.removeAll();
        this.chatWindows.removeAll();
        console.info("Disconnected from chat server.");
    }

    public sendMessage(message: string): void {
        if (!this.connected()) return;

        // TODO: hardcoded roomId
        this._connection.send(JSON.stringify({ type: "message", value: message, roomId: 0 }));
    }

    public connectButtonClick(): void {
        if (this.connected()) this.disconnect();
        else this.connect();
    }

    private getUserScreenName(id: number): string {
        const user = this.users().filter(u => u.id === id)[0];
        return user.screenName;
    }
}

class WebsocketSetup {
    private static _setupCompleted = false;

    private constructor() {}

    public static Setup(): void {
        if (WebsocketSetup._setupCompleted) return;
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        WebsocketSetup._setupCompleted = true;
    }
}

class ChatWindow {
    private _id: number;

    public messages: KnockoutObservableArray<Message>;
    public domID: KnockoutObservable<string>;
    public domHref: KnockoutComputed<string>;
    public domClass: KnockoutObservable<string>;
    public domText: KnockoutObservable<string>;

    public constructor(id: number) {
        this._id = id;
        this.messages = ko.observableArray([]);
        this.domID = ko.observable(`chat${id}`);
        this.domHref = ko.computed(() => `#${this.domID()}`, this);
        this.domClass = ko.observable("");
        this.domText = ko.observable("TODO"); // TODO:
    }

    public get id(): number { return this._id; }
}

// TODO: messageText may not need to be observable, unless I plan to allow
// editing them after the fact. Probably will so I'll probably leave this in.
// TODO: Thinking about maybe just having the server pass back messages already formatted.
// But then again the timestamps would be off. Think about this.
// TODO: Need a property here to determine how to draw the message essentially.
abstract class Message {
    public abstract messageText: KnockoutObservable<string>;
}

class SimpleMessage extends Message {
    public messageText: KnockoutObservable<string>;

    public constructor(text: string) {
        super();

        this.messageText = ko.observable(text);
    }
}

class UserMessage extends Message {
    public messageText: KnockoutObservable<string>;

    public constructor(screenName: string, text: string, timestamp: number) {
        super();

        this.messageText = ko.observable(`${this.formatTimestamp(timestamp)} ${screenName}: ${text}`);
    }

    private formatTimestamp(timestamp: number): string {
        const t = new Date(timestamp);

        let hours = t.getHours();
        let hoursPrefix = "";

        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
        if (Math.floor(hours / 10) === 0) hoursPrefix = "0";

        let minutes = t.getMinutes();
        let minutesPrefix = "";
        if (Math.floor(minutes / 10) === 0) minutesPrefix = "0";

        return `[${hoursPrefix}${hours}:${minutesPrefix}${minutes}]`;
    }
}