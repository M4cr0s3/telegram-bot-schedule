import { ConfigService, IConfigService } from '../services/config';
import { ICacheRepository } from './';
import { Redis } from '@upstash/redis';

export class RedisRepository implements ICacheRepository {
  private static _instance: ICacheRepository;
  private _redis: Redis;
  constructor(private readonly configService: IConfigService) {
    this._redis = new Redis({
      url: configService.get('REDIS_URL'),
      token: configService.get('REDIS_TOKEN'),
    });
  }

  public static getInstance(): ICacheRepository {
    if (!RedisRepository._instance) {
      RedisRepository._instance = new RedisRepository(
        ConfigService.getInstance(),
      );
    }
    return RedisRepository._instance;
  }

  public async get(key: string): Promise<any | null> {
    return await this._redis.get(key);
  }
  public async set(key: string, time: number, value: string): Promise<void> {
    await this._redis.setex(key, time, value);
  }
}
