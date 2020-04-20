import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { UnitVehDrv } from "./UnitVehDrv";
import { Sysuser } from "./Sysuser";

@Index("sdrv1", ["sfzmhm"], { unique: true })
@Index("IDX_35342c583b922fb34125a9fd39", ["sfzmhm"], { unique: true })
@Entity("drv", { schema: "pzhjj" })
export class Drv {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "dabh", nullable: true, length: 50 })
  dabh: string | null;

  @Column("varchar", { name: "sfzmmc", nullable: true, length: 10 })
  sfzmmc: string | null;

  @Column("varchar", {
    name: "sfzmhm",
    nullable: true,
    unique: true,
    length: 50
  })
  sfzmhm: string | null;

  @Column("varchar", { name: "xm", nullable: true, length: 255 })
  xm: string | null;

  @Column("varchar", { name: "sjhm", nullable: true, length: 255 })
  sjhm: string | null;

  @Column("varchar", { name: "zsxxdz", nullable: true, length: 255 })
  zsxxdz: string | null;

  @Column("json", { name: "jszimgs", nullable: true })
  jszimgs: object | null;

  @OneToMany(
    () => UnitVehDrv,
    unitVehDrv => unitVehDrv.drv
  )
  unitVehDrvs: UnitVehDrv[];

  @OneToOne(
    () => Sysuser,
    sysuser => sysuser.drv
  )
  sysuser: Sysuser;
}
