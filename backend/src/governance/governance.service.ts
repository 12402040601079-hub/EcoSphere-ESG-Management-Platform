import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssueStatus, Severity } from '@prisma/client';

@Injectable()
export class GovernanceService {
  constructor(private prisma: PrismaService) {}

  // Report a new compliance issue
  async reportIssue(data: any, userId: string, organizationId: string, departmentId: string) {
    return this.prisma.complianceIssue.create({
      data: {
        organizationId,
        departmentId,
        title: data.title,
        description: data.description,
        severity: data.severity,
        status: IssueStatus.OPEN,
        ownerUserId: data.ownerUserId || userId, // Assigned owner or self
        dueDate: new Date(data.dueDate),
        createdBy: userId,
      }
    });
  }

  // Acknowledge a policy
  async acknowledgePolicy(policyId: string, version: string, userId: string, ipAddress: string) {
    return this.prisma.policyAcknowledgement.create({
      data: {
        policyId,
        userId,
        policyVersion: version,
        ipAddress,
      }
    });
  }
}
