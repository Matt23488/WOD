import Character from "../Character";
import LocalStorageCharacterRepository from "./LocalStorageCharacterRepository";
import DummyCharacterRepository from "./DummyCharacterRepository";
import CookieCharacterRepository from "./CookieCharacterRepository";

export default interface ICharacterRepository {
    loadCharacters(): Character[];
    saveCharacters(characters: Character[]): boolean;
}

export function getCharacterRepository(type: string, ...args: any[]): ICharacterRepository {
    switch (type) {
        case "Dummy": return new DummyCharacterRepository();
        case "LocalStorage":
            if (LocalStorageCharacterRepository.IsSupported) return new LocalStorageCharacterRepository();
            else {
                swal({
                    title: `Local Storage Not Supported`,
                    text: "Your browser does not support local storage. This just means we have to use cookies to save your characters, which are not as safe as far as maintaining them. You should make sure to use the download button for each character before ending your session to ensure you have them backed up.",
                    icon: "warning",
                    button: "OK",
                    dangerMode: true
                });
            }
            break;
        // TODO: Maybe add a swal warning here.
        case "Cookie": return new CookieCharacterRepository();
    }

    return new CookieCharacterRepository();
}