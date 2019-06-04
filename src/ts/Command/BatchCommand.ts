import ICommand from "./ICommand";

export default class BatchCommand implements ICommand {
    private _commands: ICommand[];

    public constructor(...commands: ICommand[]) {
        this._commands = commands.filter(command => !command.doesNothing());
    }

    public execute(): void {
        for (let i = 0; i < this._commands.length; i++) this._commands[i].execute();
    }

    public undo(): void {
        for (let i = this._commands.length - 1; i >= 0; i--) this._commands[i].undo();
    }

    public doesNothing(): boolean {
        return this._commands.every(command => command.doesNothing());
    }
}