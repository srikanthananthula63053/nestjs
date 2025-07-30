import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as agron from 'argon2';
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
@Injectable()

export class AuthService {
    constructor(private prisma: PrismaService) { }

    async signup(dto: AuthDto) {
        //genrate password hash
        const hash = await agron.hash(dto.password)

        //save new user in db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                },

            });

            // return the save user

            return user
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken',)
                }
            }
            throw error
        }

    }

    async signin(dto: AuthDto) {

        // find the user email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        // if user doesnt exit
        if (!user) {
            throw new ForbiddenException('Credentials incorrect')
        }

        // compare the password
        const pwMatches = await agron.verify(
            user.hash,
            dto.password
        )

        // password incorrect
        if (!pwMatches) {
            throw new ForbiddenException('Credentials incorrect')
        }


        const { hash, ...userWithoutHash } = user;

        //send back to user

        return user
        

    }
}