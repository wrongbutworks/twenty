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

import { ApplicationRegistrationEntity } from 'src/engine/core-modules/application/application-registration/application-registration.entity';
import { FileEntity } from 'src/engine/core-modules/file/entities/file.entity';
import { WasIntroducedInUpgrade } from 'src/engine/core-modules/upgrade/decorators/was-introduced-in-upgrade.decorator';

@Entity({ name: 'applicationGalleryImage', schema: 'core' })
@WasIntroducedInUpgrade({
  upgradeCommandName:
    '2.20.0_CreateApplicationGalleryImageCoreTableFastInstanceCommand_1783520407274',
})
@Index('IDX_APPLICATION_GALLERY_IMAGE_FILE_ID', ['fileId'])
@Index('IDX_APPLICATION_GALLERY_IMAGE_APPLICATION_REGISTRATION_ID', [
  'applicationRegistrationId',
])
export class ApplicationGalleryImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'uuid' })
  fileId: string;

  @ManyToOne(() => FileEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'fileId' })
  file: Relation<FileEntity>;

  @Column({ type: 'integer', default: 0 })
  position: number;

  @Column({ nullable: false, type: 'uuid' })
  applicationRegistrationId: string;

  @ManyToOne(
    () => ApplicationRegistrationEntity,
    (applicationRegistration) => applicationRegistration.galleryImages,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'applicationRegistrationId' })
  applicationRegistration: Relation<ApplicationRegistrationEntity>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;
}
