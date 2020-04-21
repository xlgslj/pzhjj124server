import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("subscribe", { schema: "pzhjj" })
export class Subscribe {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "touser", nullable: true, length: 255 })
  touser: string | null;

  @Column("varchar", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("json", { name: "connect", nullable: true })
  connect: object | null;

  @Column("datetime", { name: "sj", nullable: true })
  sj: Date | null;

  @Column("json", { name: "result", nullable: true })
  result: object | null;
}
