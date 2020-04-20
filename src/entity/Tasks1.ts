import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Ywsqb } from "./Ywsqb";
import { YwFlow } from "./YwFlow";

@Index("task1-wj-2", ["pid"], {})
@Index("task1-wj-1", ["ywid"], {})
@Entity("tasks1", { schema: "pzhjj" })
export class Tasks1 {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "pid", nullable: true })
  pid: number | null;

  @Column("int", { name: "bid", nullable: true })
  bid: number | null;

  @Column("int", { name: "ywid", nullable: true })
  ywid: number | null;

  @Column("int", { name: "stepid", nullable: true })
  stepid: number | null;

  @Column("int", { name: "step", nullable: true })
  step: number | null;

  @Column("varchar", { name: "stepname", nullable: true, length: 255 })
  stepname: string | null;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("varchar", { name: "dwmc", nullable: true, length: 255 })
  dwmc: string | null;

  @Column("int", { name: "fromid", nullable: true })
  fromid: number | null;

  @Column("varchar", { name: "fromname", nullable: true, length: 255 })
  fromname: string | null;

  @Column("json", { name: "toids", nullable: true })
  toids: object | null;

  @Column("json", { name: "tonames", nullable: true })
  tonames: object | null;

  @Column("datetime", { name: "kssj", nullable: true })
  kssj: Date | null;

  @Column("int", { name: "runid", nullable: true })
  runid: number | null;

  @Column("varchar", { name: "runname", nullable: true, length: 255 })
  runname: string | null;

  @Column("datetime", { name: "jssj", nullable: true })
  jssj: Date | null;

  @Column("varchar", { name: "url0", nullable: true, length: 255 })
  url0: string | null;

  @Column("varchar", { name: "url1", nullable: true, length: 255 })
  url1: string | null;

  @Column("int", { name: "zt", nullable: true })
  zt: number | null;

  @Column("int", { name: "hdbj", nullable: true })
  hdbj: number | null;

  @Column("varchar", { name: "memo1", nullable: true, length: 255 })
  memo1: string | null;

  @Column("varchar", { name: "memo2", nullable: true, length: 255 })
  memo2: string | null;

  @ManyToOne(
    () => Ywsqb,
    ywsqb => ywsqb.tasks,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "ywid", referencedColumnName: "id" }])
  yw: Ywsqb;

  @OneToMany(
    () => YwFlow,
    ywFlow => ywFlow.t
  )
  ywFlows: YwFlow[];

  @ManyToOne(
    () => Tasks1,
    tasks1 => tasks1.tasks,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "pid", referencedColumnName: "id" }])
  p: Tasks1;

  @OneToMany(
    () => Tasks1,
    tasks1 => tasks1.p
  )
  tasks: Tasks1[];
}
