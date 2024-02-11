export class CreateUserDto {

	constructor(
		public readonly userId: number,
		public readonly first_name: string,
		public readonly last_name?: string | null,
	) {}
}
