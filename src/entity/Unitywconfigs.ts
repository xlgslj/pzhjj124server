import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Unit } from "./Unit";

@Index("unitywconfigs-wj-001", ["dwid"], {})
@Entity("unitywconfigs", { schema: "pzhjj" })
export class Unitywconfigs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("varchar", { name: "dwmc", nullable: true, length: 255 })
  dwmc: string | null;

  @Column("json", { name: "runids", nullable: true })
  runids: object | null;

  @Column("json", { name: "runnames", nullable: true })
  runnames: object | null;

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

  @ManyToOne(
    () => Unit,
    unit => unit.unitywconfigs,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "dwid", referencedColumnName: "id" }])
  dw: Unit;
}
