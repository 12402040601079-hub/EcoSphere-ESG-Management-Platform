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
exports.GovernanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let GovernanceService = class GovernanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async reportIssue(data, userId, organizationId, departmentId) {
        return this.prisma.complianceIssue.create({
            data: {
                organizationId,
                departmentId,
                title: data.title,
                description: data.description,
                severity: data.severity,
                status: client_1.IssueStatus.OPEN,
                ownerUserId: data.ownerUserId || userId,
                dueDate: new Date(data.dueDate),
                createdBy: userId,
            }
        });
    }
    async acknowledgePolicy(policyId, version, userId, ipAddress) {
        return this.prisma.policyAcknowledgement.create({
            data: {
                policyId,
                userId,
                policyVersion: version,
                ipAddress,
            }
        });
    }
};
exports.GovernanceService = GovernanceService;
exports.GovernanceService = GovernanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GovernanceService);
//# sourceMappingURL=governance.service.js.map