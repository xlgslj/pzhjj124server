import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ywconfigs", { schema: "pzhjj" })
export class Ywconfigs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "bid", nullable: true })
  bid: number | null;

  @Column("varchar", { name: "bname", nullable: true, length: 255 })
  bname: string | null;

  @Column("varchar", { name: "name0", nullable: true, length: 255 })
  name0: string | null;

  @Column("varchar", { name: "name1", nullable: true, length: 255 })
  name1: string | null;

  @Column("int", { name: "step", nullable: true })
  step: number | null;

  @Column("varchar", { name: "url0", nullable: true, length: 255 })
  url0: string | null;

  @Column("varchar", { name: "url1", nullable: true, length: 255 })
  url1: string | null;

  @Column("int", { name: "haschildren", nullable: true })
  haschildren: number | null;
}
