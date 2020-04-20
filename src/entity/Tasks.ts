import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tasks", { schema: "pzhjj" })
export class Tasks {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", { name: "fromid", nullable: true })
  fromid: number | null;

  @Column("varchar", { name: "fromname", nullable: true, length: 50 })
  fromname: string | null;

  @Column("json", { name: "toids", nullable: true })
  toids: object | null;

  @Column("json", { name: "tonames", nullable: true })
  tonames: object | null;

  @Column("int", { name: "viewid", nullable: true })
  viewid: number | null;

  @Column("json", { name: "initdata", nullable: true })
  initdata: object | null;

  @Column("datetime", { name: "kssj", nullable: true })
  kssj: Date | null;

  @Column("int", { name: "runid", nullable: true })
  runid: number | null;

  @Column("varchar", { name: "runname", nullable: true, length: 255 })
  runname: string | null;

  @Column("datetime", { name: "jssj", nullable: true })
  jssj: Date | null;

  @Column("varchar", { name: "zt", nullable: true, length: 255 })
  zt: string | null;
}
