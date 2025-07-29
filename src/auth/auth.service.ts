import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as agron from 'argon2';
@Injectable()

export class AuthService {
    constructor(private prisma: PrismaService) { }

    async signup(dto: AuthDto) {
        //genrate password hash
        const hash = await agron.hash(dto.password)

    }

    signin() {
        return { msg: 'i have sign in' }
    }
}