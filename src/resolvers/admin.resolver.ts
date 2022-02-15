import { IsEmail, Length, } from "class-validator";
import { Arg, Field, Mutation, Resolver, InputType, ObjectType } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { Admin } from "../entity/admin.entity";
import { hash, compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { environment } from "../config/environment";

@InputType()
class AdminInput {

    @Field()
    @Length(3, 64)
    fullName!: string

    @Field()
    @IsEmail()
    email!: string

    @Field()
    @Length(8, 254)
    password!: string
}

@InputType()
class LoginInput {

    @Field()
    @IsEmail()
    email!: string;

    @Field()
    password!: string;

}

@ObjectType()
class LoginResponse {

    @Field()
    userId!: number;

    @Field()
    jwt!: string;
}

@Resolver()
export class AdminResolver {

    userRepository: Repository<Admin>;

    constructor() {
        this.userRepository = getRepository(Admin);
    }

    @Mutation(() => Admin)
    async register(
        @Arg('input', () => AdminInput) input: AdminInput
    ): Promise<Admin | undefined> {

        try {
            const { fullName, email, password } = input;

            const adminExists = await this.userRepository.findOne({ where: { email } });

            if (adminExists) {
                const error = new Error();
                error.message = 'Email is not avaliable';
                throw error;
            }

            const hashedPassword = await hash(password, 10);

            const newAdmin = await this.userRepository.insert({
                fullName,
                email,
                password: hashedPassword,
            })

            return this.userRepository.findOne(newAdmin.identifiers[0].id)

        } catch (error) {
            throw new Error(error.message)
        }



    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('input', () => LoginInput) input: LoginInput
    ) {
        try {

            const { email, password } = input;

            const userFound = await this.userRepository.findOne({ where: { email } });

            if (!userFound) {
                const error = new Error();
                error.message = 'Invalid credentials';
                throw error;

            }

            const isValidPassword: boolean = compareSync(password, userFound.password);

            if (!isValidPassword) {
                const error = new Error();
                error.message = 'Invalid credentials';
                throw error;

            }


            const jwt: string = sign({ id: userFound.id }, environment.JWT_SECRET);

            return {
                userId: userFound.id,
                jwt: jwt,
            }

        } catch (e) {
            throw new Error(e.message)
        }


    }

}