import Damage from "./Character/Damage";
import CommandStack from "./Command/CommandStack";
import AttributeCommand from "./Command/AttributeCommand";
import TextInputCommand from "./Command/TextInputCommand";
import MenuBar from "./MenuBar";

export function randomInteger(minInclusive = 0, maxExclusive = 10): number {
    if (maxExclusive < minInclusive) {
        [minInclusive, maxExclusive] = [maxExclusive, minInclusive];
    }

    return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
}

export function randomFloat(minInclusive = 0, maxExclusive = 1): number {
    if (maxExclusive < minInclusive) {
        [minInclusive, maxExclusive] = [maxExclusive, minInclusive];
    }

    return Math.random() * (maxExclusive - minInclusive) + minInclusive;
}

const _observableNameMap = new Map<KnockoutObservable<any>, string>();
export function applyCustomKnockoutCode() {
    applyKnockoutBindings();
    applyKnockoutExtenders();
    applyKnockoutCustomFunctions();
}

function applyKnockoutBindings() {
    ko.bindingHandlers.menuBar = {
        init: (element: HTMLElement, valueAccessor: () => MenuBar) => {
            const menuBar = valueAccessor();
            for (let menu of menuBar.getMenus()) {
                const dropdownLi = document.createElement("li");
                dropdownLi.classList.add("nav-item");
                dropdownLi.classList.add("dropdown");

                const headerLink = document.createElement("a");
                headerLink.classList.add("nav-link");
                headerLink.classList.add("dropdown-toggle");
                headerLink.href = "#";
                headerLink.dataset.toggle = "dropdown";
                headerLink.innerText = menu.text;

                const menuContainer = document.createElement("div");
                menuContainer.classList.add("dropdown-menu");

                for (let menuOption of menu.getMenuOptions()) {
                    const optionLink = document.createElement("a");
                    optionLink.classList.add("dropdown-item");
                    if (!menuOption.visible()) optionLink.classList.add("disabled");
                    optionLink.href = "#";
                    optionLink.innerText = menuOption.text;
                    optionLink.addEventListener("click", () => {
                        if (menuOption.visible()) menuOption.callback();
                    });

                    menuContainer.appendChild(optionLink);

                    menuOption.visible.subscribe(newVal => {
                        optionLink.classList.toggle("disabled", !newVal);
                    });
                }

                dropdownLi.appendChild(headerLink);
                dropdownLi.appendChild(menuContainer);
                element.appendChild(dropdownLi);
            }
        }//,
        // update: (element: HTMLElement, valueAccessor: () => KnockoutObservable<MenuBar>) => {
        //     // element.innerHTML = "";
            
        // }
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

    ko.bindingHandlers.damageDisplay = {
        init: (element: HTMLElement) => {
            for (let i = 0; i < 15; i++) {
                const span = document.createElement("span");
                span.classList.add("damage");
                span.classList.add("none");
                element.appendChild(span);
            }
        },
        update: (element: HTMLElement, valueAccessor: () => Damage) => {
            const damageObj = valueAccessor();
            const spans = element.getElementsByTagName("span");
            for (let i = 0; i < spans.length; i++) {
                if (i < damageObj.aggravated()) {
                    spans[i].classList.remove("none");
                    spans[i].classList.remove("bashing");
                    spans[i].classList.remove("lethal");
                    spans[i].classList.add("aggravated");
                }
                else if (i - damageObj.aggravated() < damageObj.lethal()) {
                    spans[i].classList.remove("none");
                    spans[i].classList.remove("bashing");
                    spans[i].classList.remove("aggravated");
                    spans[i].classList.add("lethal");
                }
                else if (i - damageObj.aggravated() - damageObj.lethal() < damageObj.bashing()) {
                    spans[i].classList.remove("none");
                    spans[i].classList.remove("lethal");
                    spans[i].classList.remove("aggravated");
                    spans[i].classList.add("bashing");
                }
                else {
                    spans[i].classList.remove("bashing");
                    spans[i].classList.remove("lethal");
                    spans[i].classList.remove("aggravated");
                    spans[i].classList.add("none");
                }
    
                if (i < damageObj.totalHealth()) {
                    spans[i].classList.remove("HIDDEN");
                }
                else {
                    spans[i].classList.add("HIDDEN");
                }
            }
        }
    };

    ko.bindingHandlers.attribute = {
        init: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, max: number, canClear?: boolean }) => {
            const dots: Array<HTMLSpanElement> = [];
            for (let i = 0; i < valueAccessor().max; i++) {
                const dot = document.createElement("span");
                dot.classList.add("attribute-dot");
                dot.classList.add("pointer");
                dot.dataset.toggle = "tooltip";
                dot.title = "" + (i + 1);
                $(dot).tooltip();
    
                dots.push(dot);
    
                dot.addEventListener("pointerenter", () => {
                    dots.forEach((dot: HTMLSpanElement, index: number) => {
                        if (index <= i) dot.classList.add("hoverFilled");
                    });
                });
                dot.addEventListener("pointerleave", () => {
                    dots.forEach((dot: HTMLSpanElement) => {
                        dot.classList.remove("hoverFilled");
                    });
                });
            }
    
            const canClear = valueAccessor().canClear;
            if (canClear === true || typeof canClear === "undefined") {
                const clearDot = document.createElement("div");
                clearDot.classList.add("clear-dot");
                clearDot.innerHTML = "&times;";
                clearDot.dataset.toggle = "tooltip";
                clearDot.title = "Clear";
                clearDot.addEventListener("click", () => {
                    CommandStack.instance.execute(new AttributeCommand(valueAccessor().value, 0, valueAccessor().value()));
                });
                element.appendChild(clearDot);
                $(clearDot).tooltip();
            }
    
            dots.forEach((dot: HTMLSpanElement, index: number) => {
                element.appendChild(dot);
                dot.addEventListener("click", () => {
                    CommandStack.instance.execute(new AttributeCommand(valueAccessor().value, index + 1, valueAccessor().value()));
                });
            });
        },
        update: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, max: number }) => {
            const value = valueAccessor().value();
            const dots = element.getElementsByClassName("attribute-dot");
            for (let i = 0; i < dots.length; i++) {
                const dot = <HTMLSpanElement>dots[i];
                dot.style.backgroundColor = null;
                dot.style.borderColor = null;
                if (i < value) {
                    dot.style.backgroundColor = "var(--body-color)";
                    dot.style.borderColor = "var(--body-color)";
                }
            }
        }
    };
    
    ko.bindingHandlers.readOnlyAttribute = {
        init: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, max: number }) => {
            for (let i = 0; i < valueAccessor().max; i++) {
                const dot = document.createElement("span");
                dot.classList.add("attribute-dot");
                element.appendChild(dot);
            }
        },
        update: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, max: number, hideUnfilled?: boolean }) => {
            const value = valueAccessor().value();
            const dots = element.getElementsByTagName("span");
            for (let i = 0; i < dots.length; i++) {
                dots[i].classList.remove("filled");
                if (i < value) {
                    dots[i].classList.add("filled");
                    dots[i].classList.remove("HIDDEN");
                }
                else if (valueAccessor().hideUnfilled) {
                    dots[i].classList.add("HIDDEN");
                }
            }
        }
    };
    
    ko.bindingHandlers.used = {
        init: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, total: KnockoutComputed<number> }) => {
            const dots: Array<HTMLSpanElement> = [];
            for (let i = 0; i < 12; i++) {
                const dot = document.createElement("span");
                dot.classList.add("attribute-dot");
                element.appendChild(dot);
    
                dots.push(dot);
    
                dot.addEventListener("pointerenter", () => {
                    dots.forEach((dot: HTMLSpanElement, index: number) => {
                        if (index <= i) dot.classList.add("hoverFilled");
                    });
                });
                dot.addEventListener("pointerleave", () => {
                    dots.forEach((dot: HTMLSpanElement) => {
                        dot.classList.remove("hoverFilled");
                    });
                });
            }
            dots.forEach((dot: HTMLSpanElement, index: number) => {
                dot.addEventListener("click", () => {
                    CommandStack.instance.execute(new AttributeCommand(valueAccessor().value, index + 1, valueAccessor().value()));
                });
            });
        },
        update: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, total: KnockoutComputed<number> }) => {
            const used = valueAccessor().value();
            const total = valueAccessor().total();
            const dots = element.getElementsByTagName("span");
            for (let i = 0; i < dots.length; i++) {
                if (i < used) dots[i].classList.add("filled-red");
                else dots[i].classList.remove("filled-red");
    
                if (i < total) dots[i].classList.remove("HIDDEN");
                else dots[i].classList.add("HIDDEN");
            }
        }
    };
    
    ko.bindingHandlers.focusOnCreation = {
        init: (element: HTMLInputElement | HTMLTextAreaElement) => {
            window.setTimeout(() => {
                if (element.value) return;
                element.focus();
            }, 1);
        }
    };

    ko.bindingHandlers.contextMenu = {
        init: (element: HTMLElement, valueAccessor: () => () => void) => {
            element.addEventListener("contextmenu", e => {
                e.preventDefault();
                valueAccessor()();
            });
        }
    };

    ko.bindingHandlers.undoableTextInput = {
        init: (element: HTMLElement, valueAccessor: () => KnockoutObservable<string>) => {
            const inputElement = <HTMLInputElement>element;
            inputElement.addEventListener("change", () => {
                const oldValue = valueAccessor()();
                const newValue = inputElement.value;
                if (oldValue === newValue) return;

                valueAccessor()(newValue);
                if (valueAccessor()() === oldValue) return;
                valueAccessor()(oldValue);

                CommandStack.instance.execute(new TextInputCommand(valueAccessor(), newValue, oldValue));
            });
        },
        update: (element: HTMLElement, valueAccessor: () => KnockoutObservable<string>) => {
            (<HTMLInputElement>element).value = valueAccessor()();
        }
    };
}
function applyKnockoutExtenders() {
    ko.extenders.named = <T>(target: KnockoutObservable<T>, name: string) => {
        // TODO: This requires that the `named` extension be the last one listed.
        // It's messy and also inefficient because there will be multiple instances
        // of the same observable property on a character equal to the number of
        // characters the user has. I will need to come up with a different way,
        // but for now this works as a proof of concept.
        _observableNameMap.set(target, name);
        return target;
    };

    ko.extenders.lockable = <T>(target: KnockoutObservable<T>, locked: KnockoutObservable<boolean>) => {
        const result = ko.pureComputed({
            read: target,
            write: (newValue: T) => {
                if (locked()) {
                    target.notifySubscribers(target());
                }
                else {
                    target(newValue);
                    target.notifySubscribers(newValue);
                }
            }
        }).extend({ notify: "always" });
    
        return result;
    };
    
    ko.extenders.numeric = (target: KnockoutObservable<number>, args: { precision?: number, min?: number, max?: number }) => {
        const precision = args.precision || 0;
        const min = args.min || -Infinity;
        const max = args.max || Infinity;
    
        // Create a writeable computed observable to intercept writes to our observable
        const result = ko.pureComputed({
            read: target, // Always return the original observable's value
            write: (newValue: number) => {
                const current = target();
                const roundingMultiplier = Math.pow(10, precision);
                const newValueAsNum = isNaN(newValue) ? 0 : +newValue;
                let valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
                if (valueToWrite < min) valueToWrite = min;
                else if (valueToWrite > max) valueToWrite = max;
    
                // Only write if it changed
                if (valueToWrite !== current) {
                    target(valueToWrite);
                }
                else {
                    // If the rounded value is the same, but a different value was written,
                    // force a notification for the current field
                    if (newValue !== current) {
                        target.notifySubscribers(valueToWrite);
                    }
                }
            }
        }).extend({ notify: "always" });
    
        // Initialize with current value to make sure it is rounded appropriately
        result(target());
    
        // Return the new computed observable
        return result;
    };
}
function applyKnockoutCustomFunctions() {
    ko.subscribable.fn.getName = function () {
        return _observableNameMap.get(this);
    };
}