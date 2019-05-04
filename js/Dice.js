export default class Dice {
    constructor () {
        this.dicePool = ko.observable(1);
        this.rollRounds = ko.observableArray([]);
        this.totalDiceSuccesses = ko.computed(() => this.rollRounds().reduce((total, r) => total + r.reduce((total, d) => total + (d > 7 ? 1 : 0), 0), 0));
    }

    rollDice() {
        this.rollRounds.removeAll();
        let numRolls = this.dicePool();
        while (numRolls > 0) {
            let rerolls = 0;
            const currentRound = [];
            for (let i = 0; i < numRolls; i++) {
                const roll = Math.floor(Math.random() * 10) + 1;
                if (roll === 10) rerolls++;
                currentRound.push(roll)
            }
            this.rollRounds.push(currentRound);
            numRolls = rerolls;
        }
    }
}