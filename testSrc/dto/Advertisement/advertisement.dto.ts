import { AdType, Page } from '@storm-play/lib';
import { Media } from 'src/media/entities/media.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Advertisement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Page })
  page: Page;

  @Column({ type: 'enum', enum: AdType })
  type: AdType;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'link_en', length: 128 })
  linkEn: string;

  @Column({ name: 'link_cn', length: 128 })
  linkCn: string;

  @Column({ name: 'desc_en', length: 200, nullable: true })
  descEn: string;

  @Column({ name: 'desc_cn', length: 200, nullable: true })
  descCn: string;

  @Column({ nullable: true })
  logo: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Create Time',
    name: 'create_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createDate: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Update Time',
    name: 'update_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updateDate: Date;

  @Column({
    type: 'timestamp',
    comment: 'Publish Time',
    name: 'publish_date',
  })
  publishDate: Date;

  @Column({
    type: 'timestamp',
    comment: 'Remove Time',
    name: 'remove_date',
  })
  removeDate: Date;

  // relationship
  @ManyToMany(() => Media, (media) => media.advertisements, {
    cascade: true,
  })
  @JoinTable({
    name: 'advertisement_media',
    joinColumn: { name: 'advertisement_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'media_id', referencedColumnName: 'id' },
  })
  media: Media[];
}
