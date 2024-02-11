import { Telegraf } from 'telegraf';
import { Command } from '.';
import { PrismaRepository } from '../repositories';
import { CreateUserDto } from '../DTO';

export class StartCommand extends Command {
	constructor(
		bot: Telegraf,
		private readonly prismaRepository: PrismaRepository,
	) {
		super(bot);
	}
	public execute(): void {
		this.bot.start(async (ctx) => {
			await this.prismaRepository.create(
				new CreateUserDto(
					ctx.from.id,
					ctx.from.first_name,
					ctx.from.last_name,
				),
			);

			await ctx.reply(
				`Привет, ${ctx.from.first_name} ${ctx.from?.last_name ? ctx.from.last_name : ''}!`,
			);
		});
	}
}
