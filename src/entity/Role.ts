import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("role", { schema: "pzhjj" })
export class Role {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "uid", nullable: true })
  uid: number | null;

  @Column("varchar", { name: "uname", nullable: true, length: 255 })
  uname: string | null;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("varchar", { name: "dwname", nullable: true, length: 255 })
  dwname: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("json", { name: "qxs", nullable: true })
  qxs: object | null;

  @Column("varchar", { name: "memo", nullable: true, length: 1000 })
  memo: string | null;
}
