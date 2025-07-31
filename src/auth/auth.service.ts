import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as agron from 'argon2';
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { access } from "fs";
@Injectable()

export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

    async signup(dto: AuthDto) {
        //genrate password hash
        const hash = await agron.hash(dto.password)

        //save new user in db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }

            });

            // return the save user
            console.log(user.id, user.email)
            return this.signToken(user.id, user.email)
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

        //send back to user
        console.log(user.id, user.email)
        return this.signToken(user.id, user.email)
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }
        const secret =  this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(
            payload, {
            expiresIn: '15m',
            secret: secret
        })
        return { access_token:token }
        
    }
}