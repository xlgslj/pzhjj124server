import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Unitywconfigs } from "./Unitywconfigs";
import { Ywsqb } from "./Ywsqb";
import { Sysuser } from "./Sysuser";

@Entity("unit", { schema: "pzhjj" })
export class Unit {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "pid", nullable: true })
  pid: number | null;

  @Column("int", { name: "gid", nullable: true })
  gid: number | null;

  @Column("int", { name: "level", nullable: true })
  level: number | null;

  @Column("varchar", { name: "dwlx", nullable: true, length: 20 })
  dwlx: string | null;

  @Column("varchar", { name: "zddxlx", nullable: true, length: 50 })
  zddxlx: string | null;

  @Column("int", { name: "iszsdw", nullable: true })
  iszsdw: number | null;

  @Column("json", { name: "yyxz", nullable: true })
  yyxz: object | null;

  @Column("varchar", { name: "dwbm", nullable: true, length: 20 })
  dwbm: string | null;

  @Column("varchar", { name: "zzjgdm", nullable: true, length: 255 })
  zzjgdm: string | null;

  @Column("varchar", { name: "dwmc", nullable: true, length: 255 })
  dwmc: string | null;

  @Column("varchar", { name: "dwjc", nullable: true, length: 255 })
  dwjc: string | null;

  @Column("varchar", { name: "xzqh", nullable: true, length: 20 })
  xzqh: string | null;

  @Column("varchar", { name: "dwdz", nullable: true, length: 255 })
  dwdz: string | null;

  @Column("varchar", { name: "dtzb", nullable: true, length: 1000 })
  dtzb: string | null;

  @Column("json", { name: "yyzzimgs", nullable: true })
  yyzzimgs: object | null;

  @Column("json", { name: "dmzimgs", nullable: true })
  dmzimgs: object | null;

  @OneToMany(
    () => Unitywconfigs,
    unitywconfigs => unitywconfigs.dw
  )
  unitywconfigs: Unitywconfigs[];

  @OneToMany(
    () => Ywsqb,
    ywsqb => ywsqb.dw
  )
  ywsqbs: Ywsqb[];

  @OneToMany(
    () => Sysuser,
    sysuser => sysuser.dw
  )
  sysusers: Sysuser[];
}
