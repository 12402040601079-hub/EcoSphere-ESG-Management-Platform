import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { EnvironmentalService } from './environmental.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('environmental')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnvironmentalController {
  constructor(private readonly environmentalService: EnvironmentalService) {}

  @Post('carbon-log')
  @Roles(Role.EMPLOYEE, Role.MANAGER, Role.DEPARTMENT_HEAD, Role.ADMIN, Role.SUPER_ADMIN)
  async logCarbon(@Body() body: any, @Request() req: any) {
    // req.user is populated by JwtAuthGuard
    return this.environmentalService.recordCarbonTransaction(
      body,
      req.user.id,
      req.user.departmentId,
    );
  }

  @Get('transactions')
  @Roles(Role.MANAGER, Role.DEPARTMENT_HEAD, Role.ADMIN, Role.SUPER_ADMIN)
  async getTransactions(@Request() req: any) {
    return this.environmentalService.getDepartmentTransactions(req.user.departmentId);
  }
}
