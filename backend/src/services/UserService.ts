import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/Users";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
    private usersRepository: Repository<User>;

    constructor() {
        this.usersRepository = getCustomRepository(UsersRepository);
    }

    async create(email: string) {
        // Verify if users already exists

        const usersExists = await this.usersRepository.findOne({
            email
        });

        // if exits, return user 

        if (usersExists) {
            return usersExists;
        }

        // If not exists, save on database

        const user = this.usersRepository.create({ email });

        await this.usersRepository.save(user);

        return user;
    }
}

export { UsersService };
