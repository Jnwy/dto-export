import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({ enum: Page })
  @Column({ type: 'enum', enum: Page })
  page: Page;

  @ApiProperty({ enum: AdType })
  @Column({ type: 'enum', enum: AdType })
  type: AdType;

  @ApiProperty()
  @Column({ length: 50 })
  name: string;

  @ApiProperty()
  @Column({ name: 'link_en', length: 128 })
  linkEn: string;

  @ApiProperty()
  @Column({ name: 'link_cn', length: 128 })
  linkCn: string;

  @ApiProperty()
  @Column({ name: 'desc_en', length: 200, nullable: true })
  descEn: string;

  @ApiProperty()
  @Column({ name: 'desc_cn', length: 200, nullable: true })
  descCn: string;

  @ApiProperty()
  @Column({ nullable: true })
  logo: string;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Create Time',
    name: 'create_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createDate: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Update Time',
    name: 'update_date',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updateDate: Date;

  @ApiProperty()
  @Column({
    type: 'timestamp',
    comment: 'Publish Time',
    name: 'publish_date',
  })
  publishDate: Date;

  @ApiProperty()
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
