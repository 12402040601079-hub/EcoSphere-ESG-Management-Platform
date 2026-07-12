import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { GovernanceService } from './governance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('governance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Post('issues')
  @Roles(Role.EMPLOYEE, Role.MANAGER, Role.DEPARTMENT_HEAD, Role.ADMIN, Role.SUPER_ADMIN)
  async reportIssue(@Body() body: any, @Request() req: any) {
    const orgId = req.user.organizationId || 'default-org-id';
    return this.governanceService.reportIssue(body, req.user.id, orgId, req.user.departmentId);
  }

  @Post('policies/acknowledge')
  @Roles(Role.EMPLOYEE, Role.MANAGER, Role.DEPARTMENT_HEAD, Role.ADMIN, Role.SUPER_ADMIN)
  async acknowledgePolicy(@Body() body: any, @Request() req: any) {
    const ip = req.ip || '0.0.0.0';
    return this.governanceService.acknowledgePolicy(body.policyId, body.version, req.user.id, ip);
  }
}
