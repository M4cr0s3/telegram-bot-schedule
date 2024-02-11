import { Telegraf } from 'telegraf';
import { IConfigService } from '../services/config';
import {
	Command,
	ScheduleCommand,
	SettingsCommand,
	StartCommand,
} from '../commands';
import { ICacheRepository, PrismaRepository } from '../repositories';
import { CronJob } from 'cron';
import { getSchedule } from '../utils';

export class Bot {
	public bot: Telegraf;
	public commands: Command[] = [];

	constructor(
		private readonly configService: IConfigService,
		private readonly prismaRepository: PrismaRepository,
		private readonly redisRepository: ICacheRepository,
	) {
		this.bot = new Telegraf(this.configService.get('BOT_TOKEN'));
	}

	public async init() {
		this.commands = [
			new StartCommand(this.bot, this.prismaRepository),
			new ScheduleCommand(this.bot),
			new SettingsCommand(
				this.bot,
				this.prismaRepository,
				this.redisRepository,
			),
		];

		for (const command of this.commands) {
			command.execute();
		}

		new CronJob(
			'0 14 * * *',
			async () => {
				await this.notificateAllUsers();
			},
			null,
			true,
			'Europe/Moscow',
		);
	}

	public async notificateAllUsers() {
		const users = await this.prismaRepository.getAll();

		let answer = await getSchedule(
			new Date().setDate(new Date().getDate() + 1),
		);

		if (answer) {
			answer +=
				'🔔 — это уведомление от Cron. Находится в тестовом режиме.';
		}

		for (const user of users) {
			await this.bot.telegram.sendMessage(user.userId, answer);
		}
	}
}