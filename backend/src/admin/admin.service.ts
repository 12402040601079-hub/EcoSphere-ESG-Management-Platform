import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Get Organization Dashboard data
  async getDashboardStats(organizationId: string) {
    const totalCarbon = await this.prisma.carbonTransaction.aggregate({
      where: { organizationId },
      _sum: { carbonKg: true }
    });

    const totalVolunteerHours = await this.prisma.employeeParticipation.aggregate({
      where: { csrActivity: { organizationId } },
      _sum: { hoursContributed: true }
    });

    const openIssues = await this.prisma.complianceIssue.count({
      where: { organizationId, status: 'OPEN' }
    });

    return {
      totalCarbonKg: totalCarbon._sum.carbonKg || 0,
      totalVolunteerHours: totalVolunteerHours._sum.hoursContributed || 0,
      openComplianceIssues: openIssues
    };
  }

  // Add a new emission factor
  async createEmissionFactor(data: any, organizationId: string) {
    return this.prisma.emissionFactor.create({
      data: {
        organizationId,
        activityType: data.activityType,
        fuelType: data.fuelType,
        unitNumerator: data.unitNumerator || data.unit || 'unit',
        unitDenominator: data.unitDenominator || '1',
        factorValue: data.factorValue,
        scope: data.scope,
        source: data.source,
        effectiveFrom: new Date(data.validFrom || data.effectiveFrom || new Date()),
        effectiveTo: (data.validTo || data.effectiveTo) ? new Date(data.validTo || data.effectiveTo) : null
      }
    });
  }

  // Create a reward
  async createReward(data: any, organizationId: string) {
    return this.prisma.reward.create({
      data: {
        organizationId,
        name: data.title || data.name,
        description: data.description,
        pointsCost: data.pointsCost,
        stock: data.inventoryCount || data.stock || 0,
      }
    });
  }
}
