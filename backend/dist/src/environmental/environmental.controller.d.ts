import { EnvironmentalService } from './environmental.service';
export declare class EnvironmentalController {
    private readonly environmentalService;
    constructor(environmentalService: EnvironmentalService);
    logCarbon(body: any, req: any): Promise<{
        id: string;
        organizationId: string;
        departmentId: string;
        createdAt: Date;
        carbonKg: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        quantity: import("@prisma/client-runtime-utils").Decimal;
        activityType: import("@prisma/client").$Enums.ActivityType;
        fuelType: import("@prisma/client").$Enums.FuelType;
        scope: import("@prisma/client").$Enums.Scope;
        unit: import("@prisma/client").$Enums.MetricUnit;
        activityDate: Date;
        proofUrl: string | null;
        notes: string | null;
        reviewedAt: Date | null;
        recordedByUserId: string;
        emissionFactorId: string;
        reviewedBy: string | null;
    }>;
    getTransactions(req: any): Promise<({
        emissionFactor: {
            id: string;
            organizationId: string;
            activityType: import("@prisma/client").$Enums.ActivityType;
            fuelType: import("@prisma/client").$Enums.FuelType;
            factorValue: import("@prisma/client-runtime-utils").Decimal;
            unitNumerator: string;
            unitDenominator: string;
            scope: import("@prisma/client").$Enums.Scope;
            source: string | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
        };
        recordedByUser: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        organizationId: string;
        departmentId: string;
        createdAt: Date;
        carbonKg: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        quantity: import("@prisma/client-runtime-utils").Decimal;
        activityType: import("@prisma/client").$Enums.ActivityType;
        fuelType: import("@prisma/client").$Enums.FuelType;
        scope: import("@prisma/client").$Enums.Scope;
        unit: import("@prisma/client").$Enums.MetricUnit;
        activityDate: Date;
        proofUrl: string | null;
        notes: string | null;
        reviewedAt: Date | null;
        recordedByUserId: string;
        emissionFactorId: string;
        reviewedBy: string | null;
    })[]>;
}
