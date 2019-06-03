import ICommand from "./ICommand";
import BatchCommand from "./BatchCommand";

export default class CommandStack {
    private static _instance: CommandStack;
    
    private _undoStack: KnockoutObservableArray<ICommand>;
    private _redoStack: KnockoutObservableArray<ICommand>;

    public canUndo: KnockoutComputed<boolean>;
    public canRedo: KnockoutComputed<boolean>;

    private constructor() {
        this._undoStack = ko.observableArray([]);
        this._redoStack = ko.observableArray([]);

        this.canUndo = ko.computed(() => this._undoStack().length > 0, this);
        this.canRedo = ko.computed(() => this._redoStack().length > 0, this);
    }

    public static get instance(): CommandStack {
        if (!CommandStack._instance) CommandStack._instance = new CommandStack();

        return CommandStack._instance;
    }

    // TODO: Maybe don't have this as singleton...
    // Could have an instance for each character
    // to preserve the stack across character selection
    public reset(): void {
        this._undoStack.removeAll();
        this._redoStack.removeAll();
    }

    public execute(command: ICommand): void {
        if (command.doesNothing()) return;

        command.execute();
        this._undoStack.push(command);
        this._redoStack.removeAll();
    }

    public executeWithPrevious(command: ICommand, before: boolean = false): void {
        if (command.doesNothing()) return;

        command.execute();

        let previousCommand = this._undoStack.pop();
        if (before) [previousCommand, command] = [command, previousCommand];
        this._undoStack.push(new BatchCommand(previousCommand, command));
        this._redoStack.removeAll();
    }

    public undo(): void {
        if (this._undoStack().length === 0) return;
        
        const command = this._undoStack.pop();

        // TODO: Conslidate BatchCommands maybe?

        command.undo();
        this._redoStack.push(command);
    }

    public redo(): void {
        if (this._redoStack().length === 0) return;

        const command = this._redoStack.pop();
        command.execute();
        this._undoStack.push(command);
    }
}