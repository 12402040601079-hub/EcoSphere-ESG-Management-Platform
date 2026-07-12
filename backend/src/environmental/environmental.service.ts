import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnvironmentalService {
  constructor(private prisma: PrismaService) {}

  // Record a new carbon transaction
  async recordCarbonTransaction(data: any, userId: string, departmentId: string) {
    // Look up the emission factor to calculate carbon
    const factor = await this.prisma.emissionFactor.findUnique({
      where: { id: data.emissionFactorId }
    });

    if (!factor) {
      throw new NotFoundException('Emission factor not found');
    }

    // Calculate carbon amount (Quantity * Factor Value)
    const carbonKg = Number(data.quantity) * Number(factor.factorValue);

    return this.prisma.carbonTransaction.create({
      data: {
        organizationId: data.organizationId,
        departmentId: departmentId,
        recordedByUserId: userId,
        emissionFactorId: factor.id,
        activityType: factor.activityType,
        fuelType: factor.fuelType,
        quantity: data.quantity,
        unit: data.unit,
        carbonKg: carbonKg,
        scope: factor.scope,
        activityDate: new Date(data.activityDate),
        proofUrl: data.proofUrl,
        notes: data.notes,
        status: 'PENDING' // Requires approval
      }
    });
  }

  // Get all transactions for a department
  async getDepartmentTransactions(departmentId: string) {
    return this.prisma.carbonTransaction.findMany({
      where: { departmentId },
      include: {
        emissionFactor: true,
        recordedByUser: { select: { firstName: true, lastName: true } }
      },
      orderBy: { activityDate: 'desc' }
    });
  }
}
