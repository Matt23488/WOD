import ICharacterRepository from "./ICharacterRepository";
import Character from "../Character";

// This does nothing. It shouldn't actually be used when the project is finished.
export default class DummyCharacterRepository implements ICharacterRepository {
    public loadCharacters(): Character[] { return []; }
    public saveCharacters(characters: Character[]): boolean { return true; }
}