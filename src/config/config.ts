export class ConfigSingleton {
  private static instance: ConfigSingleton;

  public readonly MONGO_URI: string;
  public readonly PORT: number;
  public readonly URL_BASE_POKE_API: string;
  public readonly VERSION: string;

  private constructor() {
    this.MONGO_URI =
      process.env.MONGO_URI ||
      'mongodb://root:secret@localhost:27017/seminario-2025-1?authSource=admin';
    this.PORT = parseInt(process.env.PORT || '4000');
    this.URL_BASE_POKE_API =
      process.env.URL_BASE_POKE_API || 'https://pokeapi.co/api/v2/';
    this.VERSION = process.env.VERSION || 'pokemon';
  }

  public static getInstance(): ConfigSingleton {
    if (!ConfigSingleton.instance) {
      ConfigSingleton.instance = new ConfigSingleton();
    }
    return ConfigSingleton.instance;
  }
}
