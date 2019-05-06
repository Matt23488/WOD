$(function () {
    function Dice() {
        var self = this;
        self.dicePool = ko.observable(1);
        self.rollRounds = ko.observableArray([]);
        self.rollingInProgress = ko.observable(false);
        self.totalDiceSuccesses = ko.computed(function () {
            if (self.rollingInProgress() || self.rollRounds().length === 0) return "???";

            return self.rollRounds().reduce(function (total, r) {
                return total + r.reduce(function (total, d) {
                    return total + (d > 7 ? 1 : 0);
                }, 0);
            }, 0);
        });
    }

    Dice.prototype.incrementDicePool = function (amount) {
        return function () {
            this.dicePool(this.dicePool() + amount);
        };
    };
    
    Dice.prototype.rollDice = function () {
        var roller = new RollState(this);
        roller.beginRoll();
    };

    ko.bindingHandlers.dice = {
        update: function (element, valueAccessor) {
            var rollRounds = valueAccessor()();
            if (rollRounds.length === 0) {
                element.innerHTML = "";
                return;
            }

            var divs = element.getElementsByClassName("dice-round");
            if (divs.length !== rollRounds.length) {
                var newRound = document.createElement("div");
                newRound.classList.add("dice-round");
                var rolls = rollRounds[rollRounds.length - 1];
                for (var i = 0; i < rolls.length; i++) {
                    var span = document.createElement("span");
                    var delay = randomFloat(0, 0.5);
                    span.style.animation = "rollingDice 0.5s linear -" + delay + "s infinite alternate";
                    span.classList.add("dice");
                    newRound.appendChild(span);
                }
                element.appendChild(newRound);
                divs = element.getElementsByClassName("dice-round");
            }

            for (var i = 0; i < rollRounds.length; i++) {
                var rolls = rollRounds[i];
                var spans = divs[i].getElementsByClassName("dice");
                for (var j = 0; j < rolls.length; j++) {
                    var roll = rolls[j];
                    var span = spans[j];

                    if (roll !== -1) {
                        span.style.animation = null;
                        span.style.backgroundImage = "url('images/dice-" + roll + ".png')";
                    }
                }
            }
        }
    };

    function RollState(diceObj) {
        var self = this;
        self.diceObj = diceObj;
        self.currentRound = 0;
        self.currentDice = 0;
        self.currentRoundRolls = diceObj.dicePool();
        self.currentRoundResults = [];
        self.nextRoundRolls = 0;
        self.intervalHandle = null;
    }

    RollState.prototype.beginRoll = function () {
        var self = this;
        self.diceObj.rollingInProgress(true);
        self.diceObj.rollRounds.removeAll();
        for (var i = 0; i < self.currentRoundRolls; i++) self.currentRoundResults.push(-1);
        self.diceObj.rollRounds.push(self.currentRoundResults);

        self.intervalHandle = window.setInterval(function () {

            var nextRoll = randomInteger(1, 11);
            if (nextRoll === 10) self.nextRoundRolls++;
            self.currentRoundResults[self.currentDice] = nextRoll;
            self.diceObj.rollRounds.replace(self.diceObj.rollRounds()[self.currentRound], self.currentRoundResults);
            self.currentDice++;

            if (self.currentDice === self.currentRoundRolls) {
                if (self.nextRoundRolls === 0) {
                    window.clearInterval(self.intervalHandle);
                    self.diceObj.rollingInProgress(false);
                    return;
                }
                else {
                    self.currentRound++;
                    self.currentRoundRolls = self.nextRoundRolls;
                    self.nextRoundRolls = 0;
                    self.currentDice = 0;
                    self.currentRoundResults = [];
                    for (var i = 0; i < self.currentRoundRolls; i++) self.currentRoundResults.push(-1);
                    self.diceObj.rollRounds.push(self.currentRoundResults);
                }
            }
        }, 250);
    };

    window.Dice = Dice;
});