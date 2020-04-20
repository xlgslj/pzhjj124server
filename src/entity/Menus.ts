import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("menus", { schema: "pzhjj" })
export class Menus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "pid", nullable: true })
  pid: number | null;

  @Column("varchar", { name: "sylx", nullable: true, length: 20 })
  sylx: string | null;

  @Column("varchar", { name: "lb", nullable: true, length: 20 })
  lb: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("varchar", { name: "icon", nullable: true, length: 255 })
  icon: string | null;

  @Column("varchar", { name: "view", nullable: true, length: 255 })
  view: string | null;

  @Column("varchar", { name: "viewpath", nullable: true, length: 255 })
  viewpath: string | null;

  @Column("varchar", { name: "page", nullable: true, length: 255 })
  page: string | null;

  @Column("varchar", { name: "isapp", nullable: true, length: 20 })
  isapp: string | null;

  @Column("varchar", { name: "scope", nullable: true, length: 20 })
  scope: string | null;

  @Column("int", { name: "sort", nullable: true })
  sort: number | null;

  @Column("varchar", { name: "memo", nullable: true, length: 255 })
  memo: string | null;
}
