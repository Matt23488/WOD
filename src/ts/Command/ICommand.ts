export default interface ICommand {
    execute(): void;
    undo(): void;
    doesNothing(): boolean;
    type: string;
}