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
exports.EnvironmentalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EnvironmentalService = class EnvironmentalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recordCarbonTransaction(data, userId, departmentId) {
        const factor = await this.prisma.emissionFactor.findUnique({
            where: { id: data.emissionFactorId }
        });
        if (!factor) {
            throw new common_1.NotFoundException('Emission factor not found');
        }
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
                status: 'PENDING'
            }
        });
    }
    async getDepartmentTransactions(departmentId) {
        return this.prisma.carbonTransaction.findMany({
            where: { departmentId },
            include: {
                emissionFactor: true,
                recordedByUser: { select: { firstName: true, lastName: true } }
            },
            orderBy: { activityDate: 'desc' }
        });
    }
};
exports.EnvironmentalService = EnvironmentalService;
exports.EnvironmentalService = EnvironmentalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnvironmentalService);
//# sourceMappingURL=environmental.service.js.map