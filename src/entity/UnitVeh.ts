import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Veh } from "./Veh";

@Index("veh", ["vehid"], {})
@Entity("unit_veh", { schema: "pzhjj" })
export class UnitVeh {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("int", { name: "vehid", nullable: true })
  vehid: number | null;

  @ManyToOne(
    () => Veh,
    veh => veh.unitVehs,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "vehid", referencedColumnName: "id" }])
  veh: Veh;
}
