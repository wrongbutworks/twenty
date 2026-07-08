import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ApplicationRegistrationFileEntity } from 'src/engine/core-modules/application/application-registration-file/application-registration-file.entity';
import { type ApplicationRegistrationFileType } from 'src/engine/core-modules/application/application-registration-file/types/application-registration-file-type.type';

@Injectable()
export class ApplicationRegistrationFileService {
  constructor(
    @InjectRepository(ApplicationRegistrationFileEntity)
    private readonly applicationRegistrationFileRepository: Repository<ApplicationRegistrationFileEntity>,
  ) {}

  async findFileIdByType({
    applicationRegistrationId,
    type,
  }: {
    applicationRegistrationId: string;
    type: ApplicationRegistrationFileType;
  }): Promise<string | null> {
    const registrationFile =
      await this.applicationRegistrationFileRepository.findOne({
        where: { applicationRegistrationId, type },
      });

    return registrationFile?.fileId ?? null;
  }

  async findFilesByType({
    applicationRegistrationId,
    type,
  }: {
    applicationRegistrationId: string;
    type: ApplicationRegistrationFileType;
  }): Promise<ApplicationRegistrationFileEntity[]> {
    return this.applicationRegistrationFileRepository.find({
      where: { applicationRegistrationId, type },
      order: { position: 'ASC' },
    });
  }

  async upsertSingletonFile({
    applicationRegistrationId,
    fileId,
    type,
    isPublic,
  }: {
    applicationRegistrationId: string;
    fileId: string;
    type: ApplicationRegistrationFileType;
    isPublic: boolean;
  }): Promise<void> {
    await this.applicationRegistrationFileRepository.manager.transaction(
      async (entityManager) => {
        await entityManager.delete(ApplicationRegistrationFileEntity, {
          applicationRegistrationId,
          type,
        });

        await entityManager.insert(ApplicationRegistrationFileEntity, {
          applicationRegistrationId,
          fileId,
          type,
          isPublic,
          position: 0,
        });
      },
    );
  }

  async replaceFilesOfType({
    applicationRegistrationId,
    fileIds,
    type,
    isPublic,
  }: {
    applicationRegistrationId: string;
    fileIds: string[];
    type: ApplicationRegistrationFileType;
    isPublic: boolean;
  }): Promise<void> {
    await this.applicationRegistrationFileRepository.manager.transaction(
      async (entityManager) => {
        await entityManager.delete(ApplicationRegistrationFileEntity, {
          applicationRegistrationId,
          type,
        });

        if (fileIds.length === 0) {
          return;
        }

        await entityManager.insert(
          ApplicationRegistrationFileEntity,
          fileIds.map((fileId, position) => ({
            applicationRegistrationId,
            fileId,
            type,
            isPublic,
            position,
          })),
        );
      },
    );
  }
}
