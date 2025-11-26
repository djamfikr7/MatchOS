import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CampaignsModule } from './campaigns/campaigns.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        CampaignsModule,
    ],
})
export class AppModule { }
