import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';

import { type ApplicationRegistrationFileType } from 'src/engine/core-modules/application/application-registration-file/types/application-registration-file-type.type';
import { ApplicationRegistrationEntity } from 'src/engine/core-modules/application/application-registration/application-registration.entity';
import { FileEntity } from 'src/engine/core-modules/file/entities/file.entity';
import { WasIntroducedInUpgrade } from 'src/engine/core-modules/upgrade/decorators/was-introduced-in-upgrade.decorator';

@Entity({ name: 'applicationRegistrationFile', schema: 'core' })
@WasIntroducedInUpgrade({
  upgradeCommandName:
    '2.20.0_CreateApplicationRegistrationFileCoreTableFastInstanceCommand_1783545682387',
})
@Index('IDX_APP_REGISTRATION_FILE_FILE_ID', ['fileId'])
@Index(
  'IDX_APP_REGISTRATION_FILE_REGISTRATION_ID_FILE_ID_TYPE_UNIQUE',
  ['applicationRegistrationId', 'fileId', 'type'],
  { unique: true, where: '"deletedAt" IS NULL' },
)
@Index(
  'IDX_APP_REGISTRATION_FILE_REGISTRATION_ID_TYPE_SINGLETON',
  ['applicationRegistrationId', 'type'],
  {
    unique: true,
    where: `"type" IN ('LOGO', 'TARBALL') AND "deletedAt" IS NULL`,
  },
)
export class ApplicationRegistrationFileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'uuid' })
  applicationRegistrationId: string;

  @ManyToOne(
    () => ApplicationRegistrationEntity,
    (applicationRegistration) => applicationRegistration.files,
    { onDelete: 'CASCADE', nullable: false },
  )
  @JoinColumn({ name: 'applicationRegistrationId' })
  applicationRegistration: Relation<ApplicationRegistrationEntity>;

  @Column({ nullable: false, type: 'uuid' })
  fileId: string;

  @ManyToOne(() => FileEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'fileId' })
  file: Relation<FileEntity>;

  @Column({ nullable: false, type: 'text' })
  type: ApplicationRegistrationFileType;

  @Column({ nullable: false, type: 'integer', default: 0 })
  position: number;

  @Column({ nullable: false, type: 'boolean', default: false })
  isPublic: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;
}
