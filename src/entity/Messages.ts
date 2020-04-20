import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Sysuser } from "./Sysuser";

@Index("wmessage1", ["fromid"], {})
@Entity("messages", { schema: "pzhjj" })
export class Messages {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "type", nullable: true, length: 255 })
  type: string | null;

  @Column("int", { name: "gid", nullable: true })
  gid: number | null;

  @Column("varchar", { name: "avatarurl", nullable: true, length: 255 })
  avatarurl: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", { name: "fromid", nullable: true })
  fromid: number | null;

  @Column("varchar", { name: "fromname", nullable: true, length: 50 })
  fromname: string | null;

  @Column("json", { name: "toids", nullable: true })
  toids: object | null;

  @Column("json", { name: "tonames", nullable: true })
  tonames: object | null;

  @Column("varchar", { name: "msgtype", nullable: true, length: 255 })
  msgtype: string | null;

  @Column("varchar", { name: "content", nullable: true, length: 1000 })
  content: string | null;

  @Column("int", { name: "viewid", nullable: true })
  viewid: number | null;

  @Column("varchar", { name: "path", nullable: true, length: 255 })
  path: string | null;

  @Column("json", { name: "initdata", nullable: true })
  initdata: object | null;

  @Column("datetime", { name: "kssj", nullable: true })
  kssj: Date | null;

  @Column("int", { name: "runid", nullable: true })
  runid: number | null;

  @Column("varchar", { name: "runname", nullable: true, length: 255 })
  runname: string | null;

  @Column("datetime", { name: "jssj", nullable: true })
  jssj: Date | null;

  @Column("json", { name: "showids", nullable: true })
  showids: object | null;

  @Column("json", { name: "delids", nullable: true })
  delids: object | null;

  @Column("varchar", { name: "zt", nullable: true, length: 255 })
  zt: string | null;

  @Column("varchar", { name: "memo", nullable: true, length: 255 })
  memo: string | null;

  @ManyToOne(
    () => Sysuser,
    sysuser => sysuser.messages,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "fromid", referencedColumnName: "id" }])
  from: Sysuser;
}
