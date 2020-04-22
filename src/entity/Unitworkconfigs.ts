import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("unitworkconfigs", { schema: "pzhjj" })
export class Unitworkconfigs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("varchar", { name: "dwmc", nullable: true, length: 255 })
  dwmc: string | null;

  @Column("int", { name: "wid", nullable: true })
  wid: number | null;

  @Column("varchar", { name: "wname", nullable: true, length: 255 })
  wname: string | null;

  @Column("json", { name: "runids", nullable: true })
  runids: object | null;

  @Column("json", { name: "runnames", nullable: true })
  runnames: object | null;

  @Column("varchar", { name: "url0", nullable: true, length: 255 })
  url0: string | null;

  @Column("varchar", { name: "url1", nullable: true, length: 255 })
  url1: string | null;

  @Column("varchar", { name: "url2", nullable: true, length: 255 })
  url2: string | null;
}
