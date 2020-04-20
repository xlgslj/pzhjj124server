import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Tasks1 } from "./Tasks1";
import { Ywsqb } from "./Ywsqb";

@Index("ywflow01", ["ywid"], {})
@Index("ywflow-wj-1", ["tid"], {})
@Entity("yw_flow", { schema: "pzhjj" })
export class YwFlow {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "tid", nullable: true })
  tid: number | null;

  @Column("int", { name: "bid", nullable: true })
  bid: number | null;

  @Column("int", { name: "ywid", nullable: true })
  ywid: number | null;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("varchar", { name: "dwmc", nullable: true, length: 255 })
  dwmc: string | null;

  @Column("int", { name: "userid", nullable: true })
  userid: number | null;

  @Column("varchar", { name: "username", nullable: true, length: 255 })
  username: string | null;

  @Column("datetime", { name: "sj", nullable: true })
  sj: Date | null;

  @Column("int", { name: "step", nullable: true })
  step: number | null;

  @Column("varchar", { name: "stepname", nullable: true, length: 255 })
  stepname: string | null;

  @Column("int", { name: "zt", nullable: true })
  zt: number | null;

  @Column("varchar", { name: "memo1", nullable: true, length: 255 })
  memo1: string | null;

  @Column("varchar", { name: "memo2", nullable: true, length: 255 })
  memo2: string | null;

  @ManyToOne(
    () => Tasks1,
    tasks1 => tasks1.ywFlows,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "tid", referencedColumnName: "id" }])
  t: Tasks1;

  @ManyToOne(
    () => Ywsqb,
    ywsqb => ywsqb.ywFlows,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "ywid", referencedColumnName: "id" }])
  yw: Ywsqb;
}
