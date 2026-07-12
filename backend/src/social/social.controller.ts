import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('social')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('activities')
  @Roles(Role.MANAGER, Role.DEPARTMENT_HEAD, Role.ADMIN, Role.SUPER_ADMIN)
  async createActivity(@Body() body: any, @Request() req: any) {
    // We assume the user has an organizationId on their token/profile
    // For now we'll get it from the DB or assume it's passed or stored in user context
    // Hardcoded for demo if not in token, but we should add orgId to token payload
    const orgId = req.user.organizationId || body.organizationId;
    return this.socialService.createCsrActivity(body, req.user.id, orgId);
  }

  @Get('activities')
  @Roles(Role.EMPLOYEE, Role.MANAGER, Role.DEPARTMENT_HEAD, Role.ADMIN, Role.SUPER_ADMIN)
  async getActivities(@Request() req: any) {
    const orgId = req.user.organizationId || 'default-org-id';
    return this.socialService.getActiveActivities(orgId);
  }

  @Post('log-hours')
  @Roles(Role.EMPLOYEE, Role.MANAGER, Role.DEPARTMENT_HEAD)
  async logHours(@Body() body: any, @Request() req: any) {
    return this.socialService.logVolunteerHours(body, req.user.id);
  }
}
