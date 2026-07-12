import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(organizationId: string): Promise<{
        totalCarbonKg: number | import("@prisma/client-runtime-utils").Decimal;
        totalVolunteerHours: number | import("@prisma/client-runtime-utils").Decimal;
        openComplianceIssues: number;
    }>;
    createEmissionFactor(data: any, organizationId: string): Promise<{
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
    }>;
    createReward(data: any, organizationId: string): Promise<{
        id: string;
        organizationId: string;
        isActive: boolean;
        name: string;
        description: string | null;
        imageUrl: string | null;
        pointsCost: number;
        stock: number;
    }>;
}
