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
            this.dicePool(this.dicePool() + amount);
        };
    }

    public rollDice(): void {
        const roller = new RollState(this);
        roller.beginRoll();
    }
}

ko.bindingHandlers.dice = {
    update: (element: HTMLElement, valueAccessor: () => KnockoutObservableArray<Array<number>>) => {
        const rollRounds = valueAccessor()();
        if (rollRounds.length === 0) {
            element.innerHTML = "";
            return;
        }

        let divs = element.getElementsByClassName("dice-round");
        if (divs.length !== rollRounds.length) {
            const newRound = document.createElement("div");
            newRound.classList.add("dice-round");
            const rolls = rollRounds[rollRounds.length - 1];
            for (let i = 0; i < rolls.length; i++) {
                const span = document.createElement("span");
                const delay = randomFloat(0, 0.5);
                span.style.animation = `rollingDice 0.5s linear -${delay}s infinite alternate`;
                span.classList.add("dice");
                newRound.appendChild(span);
            }
            element.appendChild(newRound);
            divs = element.getElementsByClassName("dice-round");
        }

        for (let i = 0; i < rollRounds.length; i++) {
            const rolls = rollRounds[i];
            const spans = divs[i].getElementsByClassName("dice");
            for (let j = 0; j < rolls.length; j++) {
                const roll = rolls[j];
                const span = <HTMLSpanElement>spans[j];

                if (roll !== -1) {
                    span.style.animation = null;
                    span.style.backgroundImage = `url('images/dice-${roll}.png')`;
                }
            }
        }
    }
};

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
                let critMessage = document.getElementById("critMessage");
                if (critMessage) {
                    critMessage.remove();
                }
                critMessage = document.createElement("div");
                critMessage.classList.add("crit-message");
                critMessage.innerText = "Crit!";
                document.getElementsByClassName("diceContainer")[0].appendChild(critMessage);
            }
            this._currentRoundResults[this._currentDice] = nextRoll;
            this._diceObj.rollRounds.replace(this._diceObj.rollRounds()[this._currentRound], this._currentRoundResults);
            this._currentDice++;

            if (this._currentDice === this._currentRoundRolls) {
                if (this._nextRoundRolls === 0) {
                    window.clearInterval(this._intervalHandle);
                    this._diceObj.rollingInProgress(false);
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
        }, 250);
    }
}