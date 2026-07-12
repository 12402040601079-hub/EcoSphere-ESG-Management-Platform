import { PrismaService } from '../prisma/prisma.service';
export declare class SocialService {
    private prisma;
    constructor(prisma: PrismaService);
    createCsrActivity(data: any, userId: string, organizationId: string): Promise<{
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
    getActiveActivities(organizationId: string): Promise<({
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
    logVolunteerHours(data: any, userId: string): Promise<{
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
