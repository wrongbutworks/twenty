import { type QueryRunner } from 'typeorm';

import { RegisteredInstanceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-instance-command.decorator';
import { type FastInstanceCommand } from 'src/engine/core-modules/upgrade/interfaces/fast-instance-command.interface';

@RegisteredInstanceCommand('2.20.0', 1783545682387)
export class CreateApplicationRegistrationFileCoreTableFastInstanceCommand
  implements FastInstanceCommand
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "core"."applicationRegistrationFile" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "applicationRegistrationId" uuid NOT NULL,
        "fileId" uuid NOT NULL,
        "type" text NOT NULL,
        "position" integer NOT NULL DEFAULT 0,
        "isPublic" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_applicationRegistrationFile_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_11eed04f008f9bca7def1df371c" FOREIGN KEY ("applicationRegistrationId") REFERENCES "core"."applicationRegistration"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_25a895deea1dc7d6bf6e4b41d6f" FOREIGN KEY ("fileId") REFERENCES "core"."file"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_APP_REGISTRATION_FILE_FILE_ID"
        ON "core"."applicationRegistrationFile" ("fileId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_APP_REGISTRATION_FILE_REGISTRATION_ID_FILE_ID_TYPE_UNIQUE"
        ON "core"."applicationRegistrationFile" ("applicationRegistrationId", "fileId", "type")
        WHERE "deletedAt" IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_APP_REGISTRATION_FILE_REGISTRATION_ID_TYPE_SINGLETON"
        ON "core"."applicationRegistrationFile" ("applicationRegistrationId", "type")
        WHERE "type" IN ('LOGO', 'TARBALL') AND "deletedAt" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_APP_REGISTRATION_FILE_REGISTRATION_ID_TYPE_SINGLETON"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_APP_REGISTRATION_FILE_REGISTRATION_ID_FILE_ID_TYPE_UNIQUE"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_APP_REGISTRATION_FILE_FILE_ID"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "core"."applicationRegistrationFile"`,
    );
  }
}
