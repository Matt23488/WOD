export default class Willpower {
    constructor(totalWillpower, used) {
        this.usedWillpower = ko.observable(used || 0);
        this.totalWillpower = ko.observable(totalWillpower);
        this.totalWillpower.subscribe(val => {
            if (this.usedWillpower() > val) this.usedWillpower(val);
        });
    }

    clearUsed() {
        this.usedWillpower(0);
    }
}

ko.bindingHandlers.willpower = {
    init: function (element, valueAccessor) {
        function setup() {
            [...element.getElementsByTagName("span")].forEach(e => e.remove());
            const dots = [];
            for (let i = 0; i < valueAccessor().totalWillpower(); i++) {
                const dot = document.createElement("span");
                dot.classList.add("attribute-dot");
                if (i < valueAccessor().usedWillpower()) {
                    dot.classList.add("filled");
                }
                element.appendChild(dot);

                dots.push(dot);
                const captureDots = dots.map(dot => dot);

                dot.addEventListener("pointerenter", () => {
                    captureDots.forEach(dot => dot.classList.add("hoverFilled"));
                });
                dot.addEventListener("pointerleave", () => {
                    captureDots.forEach(dot => dot.classList.remove("hoverFilled"));
                });
            }
            dots.forEach((dot, index) => {
                dot.addEventListener("click", () => {
                    valueAccessor().usedWillpower(index + 1);
                });
            });
        }

        setup();
        valueAccessor().totalWillpower.subscribe(setup);
    },
    update: function (element, valueAccessor) {
        const usedWillpower = valueAccessor().usedWillpower();
        const dots = element.getElementsByTagName("span");

        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("filled");
            if (i < usedWillpower) {
                dots[i].classList.add("filled");
            }
        }
    }
};