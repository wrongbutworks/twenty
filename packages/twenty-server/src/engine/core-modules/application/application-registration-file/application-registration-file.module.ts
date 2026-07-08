import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationRegistrationFileEntity } from 'src/engine/core-modules/application/application-registration-file/application-registration-file.entity';
import { ApplicationRegistrationFileService } from 'src/engine/core-modules/application/application-registration-file/application-registration-file.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationRegistrationFileEntity])],
  providers: [ApplicationRegistrationFileService],
  exports: [ApplicationRegistrationFileService],
})
export class ApplicationRegistrationFileModule {}
