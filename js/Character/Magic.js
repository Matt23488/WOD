export default class Magic {
    constructor(totalMagic, used) {
        this.usedMagic = ko.observable(used || 0);
        this.totalMagic = ko.observable(totalMagic);
        this.totalMagic.subscribe(val => {
            if (this.usedMagic() > val) this.usedMagic(val);
        });
    }

    clearUsed() {
        this.usedMagic(0);
    }
}

ko.bindingHandlers.magic = {
    init: function (element, valueAccessor) {
        function setup() {
            [...element.getElementsByTagName("span")].forEach(e => e.remove());
            const dots = [];
            for (let i = 0; i < valueAccessor().totalMagic(); i++) {
                const dot = document.createElement("span");
                dot.classList.add("attribute-dot");
                if (i < valueAccessor().usedMagic()) {
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
                    valueAccessor().usedMagic(index + 1);
                });
            });
        }
        
        setup();
        valueAccessor().totalMagic.subscribe(setup);
    },
    update: function (element, valueAccessor) {
        const usedMagic = valueAccessor().usedMagic();
        const dots = element.getElementsByTagName("span");

        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("filled");
            if (i < usedMagic) {
                dots[i].classList.add("filled");
            }
        }
    }
};