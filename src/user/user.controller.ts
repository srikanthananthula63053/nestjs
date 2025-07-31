import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common';

@Controller('user')
export class UserController {
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req:any){
       
        return req.user
    }
 }
