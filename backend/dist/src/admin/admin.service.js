"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(organizationId) {
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
    async createEmissionFactor(data, organizationId) {
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
    async createReward(data, organizationId) {
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map