import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Veh } from "./Veh";
import { Drv } from "./Drv";

@Index("uvd2", ["drvid"], {})
@Index("uvd1", ["vehid"], {})
@Entity("unit_veh_drv", { schema: "pzhjj" })
export class UnitVehDrv {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("int", { name: "vehid", nullable: true })
  vehid: number | null;

  @Column("int", { name: "drvid", nullable: true })
  drvid: number | null;

  @ManyToOne(
    () => Veh,
    veh => veh.unitVehDrvs,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "vehid", referencedColumnName: "id" }])
  veh: Veh;

  @ManyToOne(
    () => Drv,
    drv => drv.unitVehDrvs,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "drvid", referencedColumnName: "id" }])
  drv: Drv;
}
