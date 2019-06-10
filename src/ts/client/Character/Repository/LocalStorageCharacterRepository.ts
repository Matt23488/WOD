import ICharacterRepository from "./ICharacterRepository";
import Character from "../Character";

const storageKey = "characters";
export default class LocalStorageCharacterRepository implements ICharacterRepository {
    public loadCharacters(): Character[] {
        return (JSON.parse(window.localStorage.getItem(storageKey)) || []).map(Character.fromJson);
    }

    public saveCharacters(characters: Character[]): boolean {
        window.localStorage.setItem("characters", JSON.stringify(characters.map(c => c.toJson())));
        return true;
    }

    public static get IsSupported(): boolean {
        const test = "test";
        try {
            window.localStorage.setItem(test, test);
            window.localStorage.removeItem(test);
            return true;
        }
        catch (e) {
            return false;
        }
    }
}