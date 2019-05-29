import ICommand from "./ICommand";

export default class CommandStack {
    private static _instance: CommandStack;
    
    private _undoStack: ICommand[];
    private _redoStack: ICommand[];

    private constructor() {
        this._undoStack = [];
        this._redoStack = [];
    }

    public static get instance(): CommandStack {
        if (!CommandStack._instance) CommandStack._instance = new CommandStack();

        return CommandStack._instance;
    }

    public execute(command: ICommand): void {
        command.execute();
        this._undoStack.push(command);
        this._redoStack = [];
    }

    public undo(): void {
        if (this._undoStack.length === 0) return;
        
        const command = this._undoStack.pop();
        command.undo();
        this._redoStack.push(command);
    }

    public redo(): void {
        if (this._redoStack.length === 0) return;

        const command = this._redoStack.pop();
        command.execute();
        this._undoStack.push(command);
    }
}