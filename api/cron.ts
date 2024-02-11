import { VercelRequest, VercelResponse } from '@vercel/node';
import { Bot } from '../src/core';
import { PrismaRepository, RedisRepository } from '../src/repositories';
import { ConfigService } from '../src/services/config';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const bot = new Bot(
      ConfigService.getInstance(),
      PrismaRepository.getInstance(),
      RedisRepository.getInstance(),
    );

    await bot.notificateAllUsers();

    res.status(200).json({ ok: true });
  } catch (e) {
    console.log(e)
  }
};
