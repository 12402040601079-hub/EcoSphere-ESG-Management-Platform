import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { EnvironmentalModule } from './environmental/environmental.module';
import { SocialModule } from './social/social.module';
import { GovernanceModule } from './governance/governance.module';
import { GamificationModule } from './gamification/gamification.module';

@Module({
  imports: [AuthModule, AdminModule, EnvironmentalModule, SocialModule, GovernanceModule, GamificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
