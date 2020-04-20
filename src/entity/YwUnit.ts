import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Ywsqb } from "./Ywsqb";

@Index("wj0001", ["ywid"], {})
@Entity("yw_unit", { schema: "pzhjj" })
export class YwUnit {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "bid", nullable: true })
  bid: number | null;

  @Column("int", { name: "ywid", nullable: true })
  ywid: number | null;

  @Column("int", { name: "type", nullable: true })
  type: number | null;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("int", { name: "step", nullable: true })
  step: number | null;

  @Column("varchar", { name: "stepname", nullable: true, length: 255 })
  stepname: string | null;

  @Column("varchar", { name: "url0", nullable: true, length: 255 })
  url0: string | null;

  @Column("varchar", { name: "url1", nullable: true, length: 255 })
  url1: string | null;

  @Column("int", { name: "zt", nullable: true })
  zt: number | null;

  @Column("varchar", { name: "memo", nullable: true, length: 255 })
  memo: string | null;

  @ManyToOne(
    () => Ywsqb,
    ywsqb => ywsqb.ywUnits,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "ywid", referencedColumnName: "id" }])
  yw: Ywsqb;
}
