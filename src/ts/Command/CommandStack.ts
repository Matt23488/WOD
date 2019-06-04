import ICommand from "./ICommand";
import BatchCommand from "./BatchCommand";

export default class CommandStack {
    private static _instance: CommandStack;
    
    private _undoStack: KnockoutObservableArray<ICommand>;
    private _redoStack: KnockoutObservableArray<ICommand>;
    private _currentlyExecuting: boolean;

    public canUndo: KnockoutComputed<boolean>;
    public canRedo: KnockoutComputed<boolean>;

    private constructor() {
        this._undoStack = ko.observableArray([]);
        this._redoStack = ko.observableArray([]);
        this._currentlyExecuting = false;

        this.canUndo = ko.computed(() => this.undoLength > 0, this);
        this.canRedo = ko.computed(() => this.redoLength > 0, this);
    }

    public static get instance(): CommandStack {
        if (!CommandStack._instance) CommandStack._instance = new CommandStack();

        return CommandStack._instance;
    }

    public get undoLength(): number { return this._undoStack().length; }
    public get redoLength(): number { return this._redoStack().length; }

    public getPreviousCommand(drillIntoBatch: boolean = false): ICommand {
        let previousCommand = this._undoStack()[this.undoLength - 1];

        if (!drillIntoBatch) return previousCommand;

        while (previousCommand instanceof BatchCommand) {
            previousCommand = previousCommand.getCommand(previousCommand.commandCount - 1);
        }

        return previousCommand;
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

        if (this._currentlyExecuting) {
            window.setTimeout(() => this.execute(command), 1);
            return;
        }

        this._currentlyExecuting = true;
        command.execute();
        this._undoStack.push(command);
        this._redoStack.removeAll();
        this._currentlyExecuting = false;
    }

    public executeWithPrevious(command: ICommand): void {
        if (command.doesNothing()) return;

        if (this._currentlyExecuting) {
            window.setTimeout(() => this.executeWithPrevious(command), 1);
            return;
        }

        this._currentlyExecuting = true;
        command.execute();
        let previousCommand = this._undoStack.pop();
        this._undoStack.push(new BatchCommand(previousCommand, command));
        this._redoStack.removeAll();
        this._currentlyExecuting = false;
    }

    public undo(): void {
        if (this._undoStack().length === 0) return;
        
        const command = this._undoStack.pop();

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