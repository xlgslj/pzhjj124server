import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("workconfigs", { schema: "pzhjj" })
export class Workconfigs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "wid", nullable: true })
  wid: number | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("varchar", { name: "url0", nullable: true, length: 255 })
  url0: string | null;

  @Column("varchar", { name: "url1", nullable: true, length: 255 })
  url1: string | null;

  @Column("varchar", { name: "url3", nullable: true, length: 255 })
  url3: string | null;
}
