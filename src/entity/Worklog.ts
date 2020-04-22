import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Unit } from "./Unit";

@Index("wj-worklog-001", ["dwid"], {})
@Entity("worklog", { schema: "pzhjj" })
export class Worklog {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "wid", nullable: true })
  wid: number | null;

  @Column("varchar", { name: "wtype", nullable: true, length: 255 })
  wtype: string | null;

  @Column("varchar", { name: "logtype", nullable: true, length: 255 })
  logtype: string | null;

  @Column("varchar", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("datetime", { name: "kssj", nullable: true })
  kssj: Date | null;

  @Column("datetime", { name: "jssj", nullable: true })
  jssj: Date | null;

  @Column("varchar", { name: "addr", nullable: true, length: 255 })
  addr: string | null;

  @Column("varchar", { name: "persons", nullable: true, length: 255 })
  persons: string | null;

  @Column("varchar", { name: "content", nullable: true, length: 255 })
  content: string | null;

  @Column("varchar", { name: "text1", nullable: true, length: 255 })
  text1: string | null;

  @Column("varchar", { name: "text2", nullable: true, length: 255 })
  text2: string | null;

  @Column("varchar", { name: "text3", nullable: true, length: 255 })
  text3: string | null;

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

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("varchar", { name: "dwmc", nullable: true, length: 255 })
  dwmc: string | null;

  @Column("int", { name: "createuid", nullable: true })
  createuid: number | null;

  @Column("varchar", { name: "createuname", nullable: true, length: 255 })
  createuname: string | null;

  @Column("json", { name: "todwids", nullable: true })
  todwids: object | null;

  @Column("json", { name: "todwmcs", nullable: true })
  todwmcs: object | null;

  @Column("json", { name: "qsdwids", nullable: true })
  qsdwids: object | null;

  @Column("varchar", { name: "qsdwmcs", nullable: true, length: 255 })
  qsdwmcs: string | null;

  @Column("json", { name: "toids", nullable: true })
  toids: object | null;

  @Column("json", { name: "tonames", nullable: true })
  tonames: object | null;

  @Column("json", { name: "qsids", nullable: true })
  qsids: object | null;

  @Column("json", { name: "qsrnames", nullable: true })
  qsrnames: object | null;

  @Column("int", { name: "qzqs", nullable: true })
  qzqs: number | null;

  @Column("datetime", { name: "createsj", nullable: true })
  createsj: Date | null;

  @Column("int", { name: "zt", nullable: true })
  zt: number | null;

  @Column("varchar", { name: "memo", nullable: true, length: 255 })
  memo: string | null;

  @ManyToOne(
    () => Unit,
    unit => unit.worklogs,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "dwid", referencedColumnName: "id" }])
  dw: Unit;
}
