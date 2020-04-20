import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("codes", { schema: "pzhjj" })
export class Codes {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "lx", nullable: true, length: 255 })
  lx: string | null;

  @Column("varchar", { name: "code", nullable: true, length: 255 })
  code: string | null;

  @Column("varchar", { name: "val", nullable: true, length: 255 })
  val: string | null;

  @Column("varchar", { name: "key1", nullable: true, length: 255 })
  key1: string | null;
}
