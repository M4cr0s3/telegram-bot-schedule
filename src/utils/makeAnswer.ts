import { Para } from '../types/types';

export function makeAnswer(schedule: Para[], date: number): string {
	let answer = `⚡️Расписание на ${new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}⚡️\n\n`;

	if (schedule.length === 0) {
		answer = `🌀Нет расписания на ${new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}🌩\n\n`;
	}

	for (const para of schedule) {
		if (para.lesson.name === 'Численные методы') {
			answer += `${para.para} пара — ${para.lesson.name}` + '👩🏻‍💻' + ` ${para.teachers[0].name}\n`;
		} else if (para.lesson.name === 'История') {
			answer += `${para.para} пара — ${para.lesson.name}` + '📜' + ` ${para.teachers[0].name}\n`;
		} else if (
			para.lesson.name ===
			'МДК 05.01 Проектирование и дизайн информационных систем'
		) {
			answer += `${para.para} пара — ${para.lesson.name}` + '😴' + ` ${para.teachers[0].name}\n`;
		} else if ( para.lesson.name === 'МДК 05.03 Тестирование информационных систем') {
			answer += `${para.para} пара — ${para.lesson.name}` + '🤖' + ` ${para.teachers[0].name}\n`;
		} else if (para.lesson.name === 'Иностранный язык в профессиональной деятельности') {
			answer += `${para.para} пара — ${para.lesson.name}` + '🇬🇧' + ` ${para.teachers[0].name}\n`;
		} else if (para.lesson.name === 'Безопасность жизнедеятельности') {
			answer += `${para.para} пара — ${para.lesson.name}` + '🛡' + ` ${para.teachers[0].name}\n`;
		} else if (para.lesson.name === 'Физическая культура') {
			answer += `${para.para} пара — ${para.lesson.name}` + '🏃‍♂️' + ` ${para.teachers[0].name}\n`;
		} else if (para.lesson.name === 'МДК 05.02 Разработка кода информационных систем') {
			answer += `${para.para} пара — ${para.lesson.name}` + '💻' + ` ${para.teachers[0].name}\n`;
		} else if (para.lesson.name === 'Стандартизация, сертификация и техническое документирование') {
			answer += `${para.para} пара — ${para.lesson.name}` + '😴' + ` ${para.teachers[0].name}\n`;
		}
	}

	return answer;
}
