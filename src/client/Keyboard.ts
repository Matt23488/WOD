const _keyboardCommands = new Map<string, () => void>();
export function registerKeyboardCommand(key: string, callback: () => void): void {
    _keyboardCommands.set(key, callback);
}

window.addEventListener("keydown", e => {
    if (e.ctrlKey !== true) return;

    for (let [key, callback] of _keyboardCommands.entries()) {
        if (e.key === key) {
            e.preventDefault();
            callback();
            return;
        }
    }
});