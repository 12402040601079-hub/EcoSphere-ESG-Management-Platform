import { GovernanceService } from './governance.service';
export declare class GovernanceController {
    private readonly governanceService;
    constructor(governanceService: GovernanceService);
    reportIssue(body: any, req: any): Promise<{
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
    acknowledgePolicy(body: any, req: any): Promise<{
        id: string;
        userId: string;
        policyVersion: string;
        acknowledgedAt: Date;
        ipAddress: string | null;
        policyId: string;
    }>;
}
