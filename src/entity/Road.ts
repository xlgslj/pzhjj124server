import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("road", { schema: "pzhjj" })
export class Road {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "lx", nullable: true, length: 20 })
  lx: string | null;

  @Column("varchar", { name: "code", nullable: true, length: 20 })
  code: string | null;

  @Column("varchar", { name: "val", nullable: true, length: 50 })
  val: string | null;

  @Column("varchar", { name: "memo", nullable: true, length: 255 })
  memo: string | null;
}
