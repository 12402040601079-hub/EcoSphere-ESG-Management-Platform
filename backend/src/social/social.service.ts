import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CsrStatus, ApprovalStatus, ParticipationRole } from '@prisma/client';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  // Create a new CSR activity
  async createCsrActivity(data: any, userId: string, organizationId: string) {
    return this.prisma.cSRActivity.create({
      data: {
        organizationId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        maxParticipants: data.maxParticipants,
        status: CsrStatus.ACTIVE,
        createdBy: userId,
      }
    });
  }

  // Get active CSR activities
  async getActiveActivities(organizationId: string) {
    return this.prisma.cSRActivity.findMany({
      where: { organizationId, status: CsrStatus.ACTIVE },
      include: { category: true }
    });
  }

  // Log volunteer hours
  async logVolunteerHours(data: any, userId: string) {
    return this.prisma.employeeParticipation.create({
      data: {
        csrActivityId: data.csrActivityId,
        userId: userId,
        hoursContributed: data.hoursContributed,
        role: ParticipationRole.VOLUNTEER,
        proofUrl: data.proofUrl,
        comments: data.comments,
        approvalStatus: ApprovalStatus.PENDING
      }
    });
  }
}
