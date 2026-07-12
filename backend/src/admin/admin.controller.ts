import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER)
  async getDashboard(@Request() req: any) {
    const orgId = req.user.organizationId || 'default-org-id';
    return this.adminService.getDashboardStats(orgId);
  }

  @Post('emission-factors')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async createEmissionFactor(@Body() body: any, @Request() req: any) {
    const orgId = req.user.organizationId || 'default-org-id';
    return this.adminService.createEmissionFactor(body, orgId);
  }

  @Post('rewards')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async createReward(@Body() body: any, @Request() req: any) {
    const orgId = req.user.organizationId || 'default-org-id';
    return this.adminService.createReward(body, orgId);
  }
}
