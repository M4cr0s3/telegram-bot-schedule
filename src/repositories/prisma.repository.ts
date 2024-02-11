import { PrismaClient, User } from '@prisma/client';
import { UserRepository } from '.';
import { CreateUserDto, UpdateUserDto } from '../DTO';

export class PrismaRepository implements UserRepository {
	private static _instance: PrismaRepository;
	private prisma: PrismaClient;
	constructor() {
		this.prisma = new PrismaClient();
	}

	public static getInstance(): PrismaRepository {
		if (!PrismaRepository._instance) {
			PrismaRepository._instance = new PrismaRepository();
		}
		return PrismaRepository._instance;
	}

	public async create(dto: CreateUserDto): Promise<User | null> {
		const existsUser = await this.getById(dto.userId);

		if (!existsUser) {
			return await this.prisma.user.create({
				data: {
					userId: dto.userId,
					first_name: dto.first_name,
					last_name: dto?.last_name,
				},
			});
		}

		return existsUser;
	}

	public async getById(userId: number): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				userId: userId,
			},
		});

		return user;
	}

	public async getAll(): Promise<User[]> {
		const users = await this.prisma.user.findMany();
		return users;
	}

	public async update(id: number, dto: UpdateUserDto): Promise<User | null> {
		const user = await this.getById(id);

		if (!user) {
			throw new Error('User not found');
		}

		return await this.prisma.user.update({
			where: {
				userId: id,
			},
			data: dto,
		});
	}
}
