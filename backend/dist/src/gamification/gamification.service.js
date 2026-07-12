"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let GamificationService = class GamificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async awardPoints(userId, points, reason) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                xpTotal: { increment: points },
                pointsBalance: { increment: points }
            }
        });
        return user;
    }
    async getUserGamificationProfile(userId) {
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
    async redeemReward(userId, rewardId) {
        const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
        if (!reward)
            throw new common_1.NotFoundException('Reward not found');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.pointsBalance < reward.pointsCost) {
            throw new common_1.BadRequestException('Not enough points');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { pointsBalance: { decrement: reward.pointsCost } }
        });
        return this.prisma.rewardRedemption.create({
            data: {
                userId,
                rewardId,
                pointsSpent: reward.pointsCost,
                status: client_1.RewardStatus.PENDING
            }
        });
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map