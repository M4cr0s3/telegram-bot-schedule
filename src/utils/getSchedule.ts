import axios from 'axios';
import { ReshaloResponse } from '../types/types';
import { makeAnswer } from './makeAnswer';

export async function getSchedule(date: number): Promise<string> {
	try {
		let answer = '';
		const todayDate = new Date(date);

		const response = await axios.get<ReshaloResponse>(
			`https://api.it-reshalo.ru//schedule?filter=41&type=group&date=${Math.floor(todayDate.setHours(3) / 1000)}`,
		);
		const schedule = response.data.result.final.reverse();

		answer = makeAnswer(schedule, date);

		return answer;
	} catch (error) {
		throw new Error('Не удалось получить расписание');
	}
}
