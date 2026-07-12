import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RewardStatus } from '@prisma/client';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  // Award XP to a user
  async awardPoints(userId: string, points: number, reason: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { 
        xpTotal: { increment: points },
        pointsBalance: { increment: points }
      }
    });

    // Also check if any badge is unlocked, in a real system we would evaluate criteria here
    // For now we just return the user
    return user;
  }

  // Get user profile points and badges
  async getUserGamificationProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        xpTotal: true,
        pointsBalance: true,
        userBadges: {
          include: { badge: true }
        }
      }
    });
    return user;
  }

  // Redeem a reward
  async redeemReward(userId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new NotFoundException('Reward not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    
    if (user.pointsBalance < reward.pointsCost) {
      throw new BadRequestException('Not enough points');
    }

    // Deduct points and create redemption record
    await this.prisma.user.update({
      where: { id: userId },
      data: { pointsBalance: { decrement: reward.pointsCost } }
    });

    return this.prisma.rewardRedemption.create({
      data: {
        userId,
        rewardId,
        pointsSpent: reward.pointsCost,
        status: RewardStatus.PENDING
      }
    });
  }
}
