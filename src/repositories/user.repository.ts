import { User } from '@prisma/client';
import { CreateUserDto } from '../DTO';

export interface UserRepository {
	create(userId: CreateUserDto): Promise<User | null>;
	getById(userId: number): Promise<any>;
}
