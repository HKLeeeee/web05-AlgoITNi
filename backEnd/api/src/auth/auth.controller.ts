import { Controller, Get, Query, Redirect, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { GithubService } from './github/github.service';
import { GoogleService } from './google/google.service';
import { UsersService } from '../users/users.service';
import { UserInfoDto } from '../users/dto/userInfo.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private githubService: GithubService,
    private googleService: GoogleService,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get('github')
  async githubProxy(@Res() res: Response) {
    const redirectUrl = await this.githubService.authProxy();
    return res.redirect(redirectUrl);
  }

  @Get('github-callback')
  @Redirect('/')
  async githubCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
  ) {
    const accessToken = await this.githubService.getGithubAccessToken(code);
    const user = await this.githubService.getUserInfo(accessToken);

    // find User
    let findUser = await this.userService.findUser(user);
    if (findUser === null) {
      // 없으면 add
      await this.userService.addUser(user, 'github');
      findUser = await this.userService.findUser(user);
    }
    if (findUser.oauth !== 'github') {
      return { message: '다른 서비스로 가입한 내역이 있습니다.' }; // TODO: set StatusCode
    }

    // 로그인 jwt 발급;
    const loginUser = new UserInfoDto();
    loginUser.id = findUser.id;
    loginUser.name = findUser.name;

    const { access_token, refresh_token } =
      await this.authService.login(loginUser);
    res.cookie('access_token', access_token, {
      httpOnly: true,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
    });

    return {
      message: 'login success',
    };
  }
}