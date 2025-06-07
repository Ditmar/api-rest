import { BaseCollection } from "../base-collection/baseCollection";

class PokeApi extends BaseCollection {
    async get(): Promise<unknown> {
        const url = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0";
        const data = await fetch(url);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        const json = await data.json();
        return json;
    }
    post(): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    delete(): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    put(): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
}

export { PokeApi };