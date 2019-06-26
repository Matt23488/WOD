import Character from "./Character/Character";

export default class Connection {
    private _character: Character;
    private _connection: WebSocket;
    private _connected: boolean;

    public serverAddress: KnockoutObservable<string>;

    public constructor(character: Character) {
        this._character = character;
        this._connected = false;

        this.serverAddress = ko.observable("");
        WebsocketSetup.Setup();
    }

    public connect(): void {
        if (this._connected) return;
        this._connection = new WebSocket(`ws://${this.serverAddress()}:3001`);

        this._connection.addEventListener("open", () => {
            this._connected = true;
            this._connection.send(JSON.stringify({ type: "name", value: this._character.name() }));
        });

        this._connection.addEventListener("error", error => {
            // TODO: Display to the user
            console.error("Could not connect to the chat server.");
        });

        this._connection.addEventListener("message", message => {
            try {
                const json = JSON.parse(message.data);
                if (json.type === "connect" || json.type === "disconnect") {
                    console.info(json.message);
                }
                else if (json.type === "message") {
                    console.log(`${json.screenName}: ${json.message}`);
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
        if (!this._connected) return;

        this._connection.close();
        this._connected = false;
        this._connection = null;
        console.info("Disconnected from chat server.");
    }

    public sendMessage(message: string): void {
        if (!this._connected) return;

        this._connection.send(JSON.stringify({ type: "message", value: message }));
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