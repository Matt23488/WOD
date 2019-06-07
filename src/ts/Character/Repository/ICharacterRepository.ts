import Character from "../Character";
import LocalStorageCharacterRepository from "./LocalStorageCharacterRepository";

export default interface ICharacterRepository {
    loadCharacters(): Character[];
    saveCharacters(characters: Character[]): boolean;
}

export function getCharacterRepository(type: string, ...args: any[]): ICharacterRepository {
    switch (type) {
        case "LocalStorage": return new LocalStorageCharacterRepository();
    }
}