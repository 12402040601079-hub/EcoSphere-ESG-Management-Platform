import { PrismaService } from '../prisma/prisma.service';
export declare class GamificationService {
    private prisma;
    constructor(prisma: PrismaService);
    awardPoints(userId: string, points: number, reason: string): Promise<{
        id: string;
        email: string;
        organizationId: string;
        departmentId: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        avatarUrl: string | null;
        xpTotal: number;
        pointsBalance: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
    getUserGamificationProfile(userId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        xpTotal: number;
        pointsBalance: number;
        userBadges: ({
            badge: {
                id: string;
                organizationId: string;
                name: string;
                description: string;
                iconUrl: string;
                tier: import("@prisma/client").$Enums.BadgeTier;
                unlockRule: import("@prisma/client/runtime/client").JsonValue;
                xpReward: number;
            };
        } & {
            id: string;
            userId: string;
            badgeId: string;
            awardedAt: Date;
        })[];
    } | null>;
    redeemReward(userId: string, rewardId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.RewardStatus;
        userId: string;
        pointsSpent: number;
        redeemedAt: Date;
        rewardId: string;
    }>;
}
