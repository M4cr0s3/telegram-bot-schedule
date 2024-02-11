import { Telegraf } from 'telegraf';

export abstract class Command {
	constructor(public bot: Telegraf) {}
	public abstract execute(): void;
}
