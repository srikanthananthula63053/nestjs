import { Injectable } from "@nestjs/common";

@Injectable()

export class AuthService {

    signup() {
        return { msg: 'i have sign up' }
    }

    signin() {
        return { msg: 'i have sign in' }
    }
}