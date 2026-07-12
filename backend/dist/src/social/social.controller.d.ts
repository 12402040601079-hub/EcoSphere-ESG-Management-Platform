import { SocialService } from './social.service';
export declare class SocialController {
    private readonly socialService;
    constructor(socialService: SocialService);
    createActivity(body: any, req: any): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        categoryId: string;
        title: string;
        description: string;
        location: string | null;
        startDate: Date;
        endDate: Date;
        maxParticipants: number | null;
        status: import("@prisma/client").$Enums.CsrStatus;
        createdBy: string;
    }>;
    getActivities(req: any): Promise<({
        category: {
            id: string;
            organizationId: string;
            isActive: boolean;
            name: string;
            type: import("@prisma/client").$Enums.CategoryType;
            pointsPerHour: number;
        };
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        categoryId: string;
        title: string;
        description: string;
        location: string | null;
        startDate: Date;
        endDate: Date;
        maxParticipants: number | null;
        status: import("@prisma/client").$Enums.CsrStatus;
        createdBy: string;
    })[]>;
    logHours(body: any, req: any): Promise<{
        comments: string | null;
        id: string;
        role: import("@prisma/client").$Enums.ParticipationRole;
        createdAt: Date;
        hoursContributed: import("@prisma/client-runtime-utils").Decimal;
        xpAwarded: number;
        proofUrl: string | null;
        approvalStatus: import("@prisma/client").$Enums.ApprovalStatus;
        approvedAt: Date | null;
        csrActivityId: string;
        userId: string;
        approvedBy: string | null;
    }>;
}
