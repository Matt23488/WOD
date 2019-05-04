$(function () {
    function Dice() {
        var self = this;
        self.dicePool = ko.observable(1);
        self.rollRounds = ko.observableArray([]);
        self.totalDiceSuccesses = ko.computed(function () {
            return self.rollRounds().reduce(function (total, r) {
                return total + r.reduce(function (total, d) {
                    return total + (d > 7 ? 1 : 0);
                }, 0);
            }, 0);
        });
    }
    
    Dice.prototype.rollDice = function () {
        var self = this;
        self.rollRounds.removeAll();
        var numRolls = self.dicePool();
        while (numRolls > 0) {
            var rerolls = 0;
            var currentRound = [];
            for (var i = 0; i < numRolls; i++) {
                var roll = Math.floor(Math.random() * 10) + 1;
                if (roll === 10) rerolls++;
                currentRound.push(roll)
            }
            self.rollRounds.push(currentRound);
            numRolls = rerolls;
        }
    };

    window.Dice = Dice;
});