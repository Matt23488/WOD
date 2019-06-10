import ICharacterRepository from "./ICharacterRepository";
import Character, { CharacterJson } from "../Character";

$.cookie.json = true;
const characterCookiePrefix = "_character-";
const characterListCookieKey = "_characters";
export default class CookieCharacterRepository implements ICharacterRepository {
    private _characterIds: number[];

    public constructor() {
        this._characterIds = [];
    }

    public loadCharacters(): Character[] {
        const characters: CharacterJson[] = [];

        this._characterIds = $.cookie(characterListCookieKey);
        if (!this._characterIds) this._characterIds = [];

        for (let characterId of this._characterIds) {
            const key = `${characterCookiePrefix}${characterId}`;
            characters.push($.cookie(key));
        }

        return characters.map(Character.fromJson);
    }

    public saveCharacters(characters: Character[]): boolean {
        for (let oldId of this._characterIds) {
            $.removeCookie(`${characterCookiePrefix}${oldId}`);
        }
        this._characterIds = [];

        for (let i = 0; i < characters.length; i++) {
            this._characterIds.push(i);
            $.cookie(`${characterCookiePrefix}${i}`, characters[i].toJson());
        }

        $.cookie(characterListCookieKey, this._characterIds);

        return true;
    }
}