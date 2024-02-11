import { Context, Markup, Scenes, Telegraf } from 'telegraf';
import { Command } from './command';
import { ICacheRepository, PrismaRepository } from '../repositories';
import { UpdateUserDto } from '../DTO';
import { CronJob } from 'cron';
import { getSchedule } from '../utils';

export class SettingsCommand extends Command {
	private activeCronJobs: Map<number, CronJob> = new Map();
	constructor(
		bot: Telegraf,
		public readonly prismaRepository: PrismaRepository,
		public readonly redisRepository: ICacheRepository,
	) {
		super(bot);
	}

	private saveCronJob(userId: number, job: CronJob) {
		this.activeCronJobs.set(userId, job);
	}

	private getExistingCronJob(userId: number): CronJob | undefined {
		return this.activeCronJobs.get(userId);
	}

	private async setupCronJob(userId: number, time: string) {
		const existingJob = this.getExistingCronJob(userId);
		if (existingJob) {
			existingJob.stop();
		}

		// Создать новую CronJob с обновленным расписанием
		const newJob = new CronJob(
			`${time.split(':')[1]} ${time.split(':')[0]} * * *`,
			async () => {
				let answer = await getSchedule(
					new Date().setDate(new Date().getDate() + 1),
				);

				if (answer) {
					answer +=
						'🔔 — это уведомление от Cron. Находится в тестовом режиме.';
				}
				await this.bot.telegram.sendMessage(userId, answer);
			},
			null,
			true,
			'Europe/Moscow',
		);

		this.saveCronJob(userId, newJob);
	}

	public execute(): void {
		this.bot.command('settings', async (ctx: Context) => {
			const chatId = ctx?.chat?.id;

			return await ctx.telegram.sendMessage(
				String(chatId),
				'🛠️ Изменение настроек.',
				Markup.inlineKeyboard([
					Markup.button.callback(
						'⌚ Установить время отправки расписания.',
						'set_time',
					),
				]),
			);
		});

		this.bot.action('set_time', async (ctx: Context) => {
			const chatId = ctx?.chat?.id;

			await ctx.telegram.editMessageText(
				String(chatId),
				ctx?.callbackQuery?.message?.message_id,
				ctx.callbackQuery?.inline_message_id,
				'⏰ Введите время в формате ЧЧ:ММ.',
				Markup.inlineKeyboard([
					Markup.button.callback('Отмена', 'cancel'),
				]),
			);

			this.bot.hears(
				/^[0-1][0-9]:[0-5][0-9]|2[0-3]:[0-5][0-9]$/,
				async (ctx: Context) => {
					const userId = ctx.from?.id;
					if (ctx.message && userId) {
						//@ts-ignore
						const time = ctx.message.text;
						const userTime = await this.redisRepository.get(
							`${userId}_time`,
						);

						if (userTime) {
							await ctx.reply(
								'Вы уже установили время. Попробуйте позже.',
							);
						} else {
							await this.redisRepository.set(
								`${userId}_time`,
								100,
								time,
							);
							await this.prismaRepository.update(
								userId,
								new UpdateUserDto(time),
							);
							await ctx.reply(`Вы установили время: ${time}.`);
							this.setupCronJob(userId, time);
							console.log(this.activeCronJobs);
						}
					}
				},
			);
		});

		this.bot.action('cancel', async (ctx: Context) => {
			return await ctx.answerCbQuery('Отменено.');
		});
	}
}
