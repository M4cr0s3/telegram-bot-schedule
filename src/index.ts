import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import { Bot } from './core';
import { PrismaRepository, RedisRepository } from './repositories';
import { ConfigService } from './services/config';

const ENVIRONMENT = process.env.NODE_ENV || 'development';

const bot = new Bot(
  ConfigService.getInstance(),
  PrismaRepository.getInstance(),
  RedisRepository.getInstance(),
);

bot.init();

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot.bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot.bot);
