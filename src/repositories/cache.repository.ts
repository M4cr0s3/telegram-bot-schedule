export interface ICacheRepository {
	get(key: string): Promise<any | null>;
	set(key: string, time: number, value: string): Promise<void>;
}
