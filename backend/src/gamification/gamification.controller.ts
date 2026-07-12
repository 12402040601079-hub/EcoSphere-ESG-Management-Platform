import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.gamificationService.getUserGamificationProfile(req.user.id);
  }

  @Post('redeem')
  async redeemReward(@Body() body: any, @Request() req: any) {
    return this.gamificationService.redeemReward(req.user.id, body.rewardId);
  }
}
