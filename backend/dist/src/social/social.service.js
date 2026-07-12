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
exports.SocialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SocialService = class SocialService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCsrActivity(data, userId, organizationId) {
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
                status: client_1.CsrStatus.ACTIVE,
                createdBy: userId,
            }
        });
    }
    async getActiveActivities(organizationId) {
        return this.prisma.cSRActivity.findMany({
            where: { organizationId, status: client_1.CsrStatus.ACTIVE },
            include: { category: true }
        });
    }
    async logVolunteerHours(data, userId) {
        return this.prisma.employeeParticipation.create({
            data: {
                csrActivityId: data.csrActivityId,
                userId: userId,
                hoursContributed: data.hoursContributed,
                role: client_1.ParticipationRole.VOLUNTEER,
                proofUrl: data.proofUrl,
                comments: data.comments,
                approvalStatus: client_1.ApprovalStatus.PENDING
            }
        });
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SocialService);
//# sourceMappingURL=social.service.js.map