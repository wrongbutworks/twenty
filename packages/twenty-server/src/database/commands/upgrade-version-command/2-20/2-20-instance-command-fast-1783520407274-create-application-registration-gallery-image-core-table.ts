import { type QueryRunner } from 'typeorm';

import { RegisteredInstanceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-instance-command.decorator';
import { type FastInstanceCommand } from 'src/engine/core-modules/upgrade/interfaces/fast-instance-command.interface';

@RegisteredInstanceCommand('2.20.0', 1783520407274)
export class CreateApplicationRegistrationGalleryImageCoreTableFastInstanceCommand
  implements FastInstanceCommand
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "core"."applicationRegistrationGalleryImage" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "fileId" uuid NOT NULL,
        "position" integer NOT NULL DEFAULT 0,
        "applicationRegistrationId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_applicationRegistrationGalleryImage_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_1c5277c80a81e4f2b95ae6fd846" FOREIGN KEY ("fileId") REFERENCES "core"."file"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_851a5f0662f7f516a740bacd470" FOREIGN KEY ("applicationRegistrationId") REFERENCES "core"."applicationRegistration"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_APPLICATION_REGISTRATION_GALLERY_IMAGE_REGISTRATION_ID"
        ON "core"."applicationRegistrationGalleryImage" ("applicationRegistrationId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_APPLICATION_REGISTRATION_GALLERY_IMAGE_FILE_ID"
        ON "core"."applicationRegistrationGalleryImage" ("fileId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_APPLICATION_REGISTRATION_GALLERY_IMAGE_FILE_ID"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_APPLICATION_REGISTRATION_GALLERY_IMAGE_REGISTRATION_ID"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "core"."applicationRegistrationGalleryImage"`,
    );
  }
}
