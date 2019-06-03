import { randomFloat, randomInteger } from "./utils";

export default class Dice {
    public dicePool: KnockoutObservable<number>;
    public rollRounds: KnockoutObservableArray<Array<number>>;
    public rollingInProgress: KnockoutObservable<boolean>;
    public totalDiceSuccesses: KnockoutComputed<number>;
    public totalDiceSuccessesDisplay: KnockoutComputed<string>;

    public constructor() {
        this.dicePool = ko.observable(1);
        this.rollRounds = ko.observableArray([]);
        this.rollingInProgress = ko.observable(false);
        this.totalDiceSuccesses = ko.computed(() => {
            if (this.rollingInProgress() || this.rollRounds().length === 0) return -1;

            return this.rollRounds().reduce((total: number, r: Array<number>) => {
                return total + r.reduce((total: number, d: number) => total + (d > 7 ? 1 : 0), 0);
            }, 0);
        }, this);
        this.totalDiceSuccessesDisplay = ko.computed(() => {
            return this.totalDiceSuccesses() >= 0 ? "" + this.totalDiceSuccesses() : "???";
        }, this);
    }

    public incrementDicePool(amount: number): () => void {
        return () => {
            let newAmount = this.dicePool() + amount;
            if (newAmount < 1) newAmount = 1;
            this.dicePool(newAmount);
        };
    }

    public rollDice(): void {
        const roller = new RollState(this);
        roller.beginRoll();
    }
}

class RollState {
    private _diceObj: Dice;
    private _currentRound: number;
    private _currentDice: number;
    private _currentRoundRolls: number;
    private _currentRoundResults: Array<number>;
    private _nextRoundRolls: number;
    private _intervalHandle: number;

    public constructor(diceObj: Dice) {
        this._diceObj = diceObj;
        this._currentRound = 0;
        this._currentDice = 0;
        this._currentRoundRolls = diceObj.dicePool();
        this._currentRoundResults = [];
        this._nextRoundRolls = 0;
        this._intervalHandle = null;
    }

    public beginRoll(): void {
        this._diceObj.rollingInProgress(true);
        this._diceObj.rollRounds.removeAll();
        for (let i = 0; i < this._currentRoundRolls; i++) this._currentRoundResults.push(-1);
        this._diceObj.rollRounds.push(this._currentRoundResults);

        this._intervalHandle = window.setInterval(() => {
            const nextRoll = randomInteger(1, 11);
            if (nextRoll === 10) {
                this._nextRoundRolls++;
                const diceContainer = document.getElementsByClassName("diceContainer")[0];
                const critMessage = document.createElement("div");
                critMessage.classList.add("crit-message");
                critMessage.innerText = "Crit!";
                critMessage.id = "critMessage";
                diceContainer.appendChild(critMessage);
                window.setTimeout(() => diceContainer.removeChild(critMessage), 1010);
            }
            this._currentRoundResults[this._currentDice] = nextRoll;
            this._diceObj.rollRounds.replace(this._diceObj.rollRounds()[this._currentRound], this._currentRoundResults);
            this._currentDice++;

            if (this._currentDice === this._currentRoundRolls) {
                if (this._nextRoundRolls === 0) {
                    window.clearInterval(this._intervalHandle);
                    this._diceObj.rollingInProgress(false);
                    const critMessage = document.getElementById("critMessage");
                    if (critMessage) {
                        critMessage.remove();
                    }
                    return;
                }
                else {
                    this._currentRound++;
                    this._currentRoundRolls = this._nextRoundRolls;
                    this._nextRoundRolls = 0;
                    this._currentDice = 0;
                    this._currentRoundResults = [];
                    for (let i = 0; i < this._currentRoundRolls; i++) this._currentRoundResults.push(-1);
                    this._diceObj.rollRounds.push(this._currentRoundResults);
                }
            }
        }, 100);
    }
}