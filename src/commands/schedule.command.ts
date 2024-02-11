import { Context, Markup, Telegraf } from 'telegraf';
import { Command } from './command';
import { getSchedule } from '../utils';

export class ScheduleCommand extends Command {
	constructor(bot: Telegraf) {
		super(bot);
	}

	public execute(): void {
		this.bot.command('rasp', async (ctx: Context) => {
			const chatId = ctx?.chat?.id;

			const answer = await getSchedule(new Date().getTime());

			await ctx.telegram.sendMessage(
				String(chatId),
				answer,
				Markup.inlineKeyboard([
					Markup.button.callback('📅 Вчера', 'schedule_yesterday'),
					Markup.button.callback('🎯 Завтра', 'schedule_tomorrow'),
				]),
			);
		});

		this.bot.action('schedule_yesterday', async (ctx: Context) => {
			const chatId = ctx?.chat?.id;

			const answer = await getSchedule(
				new Date().setDate(new Date().getDate() - 1),
			);

			await ctx.telegram.editMessageText(
				chatId,
				ctx?.callbackQuery?.message?.message_id,
				ctx.callbackQuery?.inline_message_id,
				answer,
				Markup.inlineKeyboard([
					Markup.button.callback('🎯 Текущее', 'schedule_current'),
					Markup.button.callback('⚡ Завтра', 'schedule_tomorrow'),
				]),
			);
		});

		this.bot.action('schedule_current', async (ctx: Context) => {
			const chatId = ctx?.chat?.id;

			const answer = await getSchedule(new Date().getTime());

			await ctx.telegram.editMessageText(
				chatId,
				ctx?.callbackQuery?.message?.message_id,
				ctx.callbackQuery?.inline_message_id,
				answer,
				Markup.inlineKeyboard([
					Markup.button.callback('📅 Вчера', 'schedule_yesterday'),
					Markup.button.callback('⚡ Завтра', 'schedule_tomorrow'),
				]),
			);
		});

		this.bot.action('schedule_tomorrow', async (ctx: Context) => {
			const chatId = ctx?.chat?.id;

			const answer = await getSchedule(
				new Date().setDate(new Date().getDate() + 1),
			);

			await ctx.telegram.editMessageText(
				chatId,
				ctx?.callbackQuery?.message?.message_id,
				ctx.callbackQuery?.inline_message_id,
				answer,
				Markup.inlineKeyboard([
					Markup.button.callback(
						'📅 Вчерашнее',
						'schedule_yesterday',
					),
					Markup.button.callback('🎯 Текущее', 'schedule_current'),
				]),
			);
		});
	}
}
