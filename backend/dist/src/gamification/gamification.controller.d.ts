import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getProfile(req: any): Promise<{
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
    redeemReward(body: any, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.RewardStatus;
        userId: string;
        pointsSpent: number;
        redeemedAt: Date;
        rewardId: string;
    }>;
}
