import { DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from './';

export class ConfigService implements IConfigService {
	private static _instance: ConfigService = new ConfigService();
	private config: DotenvParseOutput;

	constructor() {
		if (ConfigService._instance) {
			throw new Error(
				'Error: Instantiation failed: Use ConfigService.getInstance() instead of new.',
			);
		}
		ConfigService._instance = this;

		const { error, parsed } = config({ path: '.env' });

		if (error) {
			throw new Error('Не найден файл .env');
		}

		if (!parsed) {
			throw new Error('Не удалось прочитать файл .env');
		}

		this.config = parsed;
	}

	public static getInstance() {
		return ConfigService._instance;
	}

	public get(key: string): string {
		const res = this.config[key];

		if (!key) {
			throw new Error('Не передан ключ');
		}

		return res;
	}
}
