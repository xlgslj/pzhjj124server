import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Tasks1 } from "./Tasks1";
import { YwUnit } from "./YwUnit";
import { Unit } from "./Unit";
import { YwFlow } from "./YwFlow";

@Index("wj001", ["dwid"], {})
@Entity("ywsqb", { schema: "pzhjj" })
export class Ywsqb {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "vehid", nullable: true })
  vehid: number | null;

  @Column("varchar", { name: "hphm", nullable: true, length: 20 })
  hphm: string | null;

  @Column("varchar", { name: "hpzl", nullable: true, length: 4 })
  hpzl: string | null;

  @Column("int", { name: "bid", nullable: true })
  bid: number | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("varchar", { name: "dwmc", nullable: true, length: 255 })
  dwmc: string | null;

  @Column("int", { name: "sqrid", nullable: true })
  sqrid: number | null;

  @Column("varchar", { name: "sqr", nullable: true, length: 255 })
  sqr: string | null;

  @Column("int", { name: "gid", nullable: true })
  gid: number | null;

  @Column("int", { name: "gdwiszsdw", nullable: true })
  gdwiszsdw: number | null;

  @Column("json", { name: "runids", nullable: true })
  runids: object | null;

  @Column("json", { name: "runnames", nullable: true })
  runnames: object | null;

  @Column("datetime", { name: "kssj", nullable: true })
  kssj: Date | null;

  @Column("datetime", { name: "jssj", nullable: true })
  jssj: Date | null;

  @Column("date", { name: "yxqs", nullable: true })
  yxqs: string | null;

  @Column("date", { name: "yxqz", nullable: true })
  yxqz: string | null;

  @Column("int", { name: "id1", nullable: true })
  id1: number | null;

  @Column("int", { name: "id2", nullable: true })
  id2: number | null;

  @Column("varchar", { name: "txt1", nullable: true, length: 255 })
  txt1: string | null;

  @Column("varchar", { name: "txt2", nullable: true, length: 255 })
  txt2: string | null;

  @Column("varchar", { name: "txt3", nullable: true, length: 255 })
  txt3: string | null;

  @Column("json", { name: "json1", nullable: true })
  json1: object | null;

  @Column("json", { name: "json2", nullable: true })
  json2: object | null;

  @Column("json", { name: "json3", nullable: true })
  json3: object | null;

  @Column("json", { name: "json4", nullable: true })
  json4: object | null;

  @Column("json", { name: "json5", nullable: true })
  json5: object | null;

  @Column("json", { name: "delids", nullable: true })
  delids: object | null;

  @Column("int", { name: "zt", nullable: true })
  zt: number | null;

  @Column("int", { name: "step", nullable: true })
  step: number | null;

  @Column("json", { name: "steps", nullable: true })
  steps: object | null;

  @Column("varchar", { name: "memo", nullable: true, length: 255 })
  memo: string | null;

  @Column("varchar", { name: "stepname", nullable: true, length: 255 })
  stepname: string | null;

  @OneToMany(
    () => Tasks1,
    tasks1 => tasks1.yw
  )
  tasks: Tasks1[];

  @OneToMany(
    () => YwUnit,
    ywUnit => ywUnit.yw
  )
  ywUnits: YwUnit[];

  @ManyToOne(
    () => Unit,
    unit => unit.ywsqbs,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "dwid", referencedColumnName: "id" }])
  dw: Unit;

  @OneToMany(
    () => YwFlow,
    ywFlow => ywFlow.yw
  )
  ywFlows: YwFlow[];
}
