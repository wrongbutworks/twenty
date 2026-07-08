import { type QueryRunner } from 'typeorm';

import { RegisteredInstanceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-instance-command.decorator';
import { type FastInstanceCommand } from 'src/engine/core-modules/upgrade/interfaces/fast-instance-command.interface';

@RegisteredInstanceCommand('2.20.0', 1783520407274)
export class CreateApplicationGalleryImageCoreTableFastInstanceCommand
  implements FastInstanceCommand
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "core"."applicationGalleryImage" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "fileId" uuid NOT NULL,
        "position" integer NOT NULL DEFAULT 0,
        "applicationRegistrationId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_applicationGalleryImage_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ff8bb1370937605af25d632bacc" FOREIGN KEY ("fileId") REFERENCES "core"."file"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_27046d38d152c4047b27674a54e" FOREIGN KEY ("applicationRegistrationId") REFERENCES "core"."applicationRegistration"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_APPLICATION_GALLERY_IMAGE_APPLICATION_REGISTRATION_ID"
        ON "core"."applicationGalleryImage" ("applicationRegistrationId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_APPLICATION_GALLERY_IMAGE_FILE_ID"
        ON "core"."applicationGalleryImage" ("fileId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_APPLICATION_GALLERY_IMAGE_FILE_ID"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_APPLICATION_GALLERY_IMAGE_APPLICATION_REGISTRATION_ID"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "core"."applicationGalleryImage"`,
    );
  }
}
