export type ReshaloResponse = {
	result: Result;
	redirected: boolean;
};

export type Result = {
	change: Array<any>;
	main: Array<any>;
	bell: Array<any>;
	final: Array<Para>;
	mode: string;
};

export type Para = {
	id: number;
	week_type: number;
	weekday: number;
	para: number;
	lesson: Lesson;
	teachers: Array<any>;
	cabinet: Cabinet;
	subgroup: number;
	schedule_id: number;
	group: Group;
	teacher: Teacher;
	type: string;
};

export type Lesson = {
	id: number;
	name: string;
	short_name: string;
};

export type Cabinet = {
	id: number;
	name: string;
};

export type Group = {
	id: number;
	name: string;
	course: number;
	specialization: Object;
};

export type Teacher = {
	id: number;
	name: string;
	full_name: string;
	instrumental_case: string;
};
