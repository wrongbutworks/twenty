import { type DataSource, type QueryRunner } from 'typeorm';

import { RegisteredInstanceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-instance-command.decorator';
import { type SlowInstanceCommand } from 'src/engine/core-modules/upgrade/interfaces/slow-instance-command.interface';

@RegisteredInstanceCommand('2.20.0', 1783545682388, { type: 'slow' })
export class MigrateTarballFileToApplicationRegistrationFileSlowInstanceCommand
  implements SlowInstanceCommand
{
  async runDataMigration(dataSource: DataSource): Promise<void> {
    await dataSource.query(
      `INSERT INTO "core"."applicationRegistrationFile"
        ("applicationRegistrationId", "fileId", "type", "position", "isPublic")
      SELECT "id", "tarballFileId", 'TARBALL', 0, false
      FROM "core"."applicationRegistration"
      WHERE "tarballFileId" IS NOT NULL
      ON CONFLICT DO NOTHING`,
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT IF EXISTS "FK_36715821de396df9536fd4afc81"',
    );
    await queryRunner.query(
      'ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT IF EXISTS "REL_36715821de396df9536fd4afc8"',
    );
    await queryRunner.query(
      'ALTER TABLE "core"."applicationRegistration" DROP COLUMN IF EXISTS "tarballFileId"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "tarballFileId" uuid',
    );
    await queryRunner.query(
      `UPDATE "core"."applicationRegistration" AS "registration"
      SET "tarballFileId" = "registrationFile"."fileId"
      FROM "core"."applicationRegistrationFile" AS "registrationFile"
      WHERE "registrationFile"."applicationRegistrationId" = "registration"."id"
        AND "registrationFile"."type" = 'TARBALL'`,
    );
    await queryRunner.query(
      'ALTER TABLE "core"."applicationRegistration" ADD CONSTRAINT "REL_36715821de396df9536fd4afc8" UNIQUE ("tarballFileId")',
    );
    await queryRunner.query(
      'ALTER TABLE "core"."applicationRegistration" ADD CONSTRAINT "FK_36715821de396df9536fd4afc81" FOREIGN KEY ("tarballFileId") REFERENCES "core"."file"("id") ON DELETE SET NULL ON UPDATE NO ACTION',
    );
  }
}
