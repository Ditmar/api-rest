import { BaseCollection } from "../base-collection/baseCollection";
import { ConfigSingleton } from '../../config/config';
class PokeApi extends BaseCollection {
    async get(): Promise<unknown> {
        const url = ConfigSingleton.getInstance().URL_BASE_POKE_API + ConfigSingleton.getInstance().VERSION;
        const data = await fetch(url);
        if (!data.ok) {
            throw new Error(`HTTP error! status: ${data.status}`);
        }
        const json = await data.json();
        return json;
    }
    post(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    delete(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    put(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    
}

export { PokeApi };