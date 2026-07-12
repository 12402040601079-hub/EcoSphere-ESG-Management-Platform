import { PrismaService } from '../prisma/prisma.service';
export declare class GovernanceService {
    private prisma;
    constructor(prisma: PrismaService);
    reportIssue(data: any, userId: string, organizationId: string, departmentId: string): Promise<{
        id: string;
        organizationId: string;
        departmentId: string;
        createdAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.IssueStatus;
        createdBy: string;
        severity: import("@prisma/client").$Enums.Severity;
        dueDate: Date;
        resolvedAt: Date | null;
        ownerUserId: string;
    }>;
    acknowledgePolicy(policyId: string, version: string, userId: string, ipAddress: string): Promise<{
        id: string;
        userId: string;
        policyVersion: string;
        acknowledgedAt: Date;
        ipAddress: string | null;
        policyId: string;
    }>;
}
