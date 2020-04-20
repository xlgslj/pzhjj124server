import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UnitVehDrv } from "./UnitVehDrv";
import { UnitVeh } from "./UnitVeh";

@Entity("veh", { schema: "pzhjj" })
export class Veh {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("varchar", { name: "hpzl", nullable: true, length: 5 })
  hpzl: string | null;

  @Column("varchar", { name: "hphm", nullable: true, length: 10 })
  hphm: string | null;

  @Column("varchar", { name: "clpp1", nullable: true, length: 255 })
  clpp1: string | null;

  @Column("varchar", { name: "clxh", nullable: true, length: 255 })
  clxh: string | null;

  @Column("varchar", { name: "cllx", nullable: true, length: 255 })
  cllx: string | null;

  @Column("varchar", { name: "clsbdh", nullable: true, length: 255 })
  clsbdh: string | null;

  @Column("varchar", { name: "fdjh", nullable: true, length: 255 })
  fdjh: string | null;

  @Column("varchar", { name: "csys", nullable: true, length: 255 })
  csys: string | null;

  @Column("varchar", { name: "syxz", nullable: true, length: 255 })
  syxz: string | null;

  @Column("datetime", { name: "ccdjrq", nullable: true })
  ccdjrq: Date | null;

  @Column("datetime", { name: "qzbfqz", nullable: true })
  qzbfqz: Date | null;

  @Column("datetime", { name: "yxqz", nullable: true })
  yxqz: Date | null;

  @Column("datetime", { name: "bxzzrq", nullable: true })
  bxzzrq: Date | null;

  @Column("varchar", { name: "syr", nullable: true, length: 255 })
  syr: string | null;

  @Column("varchar", { name: "sfzmmc", nullable: true, length: 255 })
  sfzmmc: string | null;

  @Column("varchar", { name: "sfzmhm", nullable: true, length: 255 })
  sfzmhm: string | null;

  @Column("varchar", { name: "zsxxdz", nullable: true, length: 255 })
  zsxxdz: string | null;

  @Column("json", { name: "xszimgs", nullable: true })
  xszimgs: object | null;

  @OneToMany(
    () => UnitVehDrv,
    unitVehDrv => unitVehDrv.veh
  )
  unitVehDrvs: UnitVehDrv[];

  @OneToMany(
    () => UnitVeh,
    unitVeh => unitVeh.veh
  )
  unitVehs: UnitVeh[];
}
