import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Messages } from "./Messages";
import { Unit } from "./Unit";
import { Drv } from "./Drv";

@Index("账号重复", ["uid"], { unique: true })
@Index("IDX_10552812ef852b07263982b139", ["uid"], { unique: true })
@Index("IDX_31a54c3cd575924435445b0198", ["unionid"], { unique: true })
@Index("身份证号重复", ["sfzmhm"], { unique: true })
@Index("手机号重复", ["sjhm"], { unique: true })
@Index("小程序号重复", ["openid"], { unique: true })
@Index("sysuser-index-1", ["drvid"], { unique: true })
@Index("IDX_2d9c51f31a8404effc7dc6c457", ["sfzmhm"], { unique: true })
@Index("IDX_ced6df75cb7171991e26691879", ["sjhm"], { unique: true })
@Index("IDX_8e8a0bd80323399ed12fa5e3a3", ["unionid"], { unique: true })
@Index("IDX_f89ba73f92502361374f7f9861", ["openid"], { unique: true })
@Index("IDX_b9a6b5c9304a26999cd72bbd9c", ["drvid"], { unique: true })
@Index("sysuser-index-2", ["dwid"], {})
@Entity("sysuser", { schema: "pzhjj" })
export class Sysuser {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "type", nullable: true, length: 20 })
  type: string | null;

  @Column("int", { name: "isadmin", nullable: true })
  isadmin: number | null;

  @Column("varchar", { name: "zw", nullable: true, length: 255 })
  zw: string | null;

  @Column("varchar", { name: "uid", unique: true, length: 50 })
  uid: string;

  @Column("varchar", {
    name: "sfzmhm",
    nullable: true,
    unique: true,
    length: 18
  })
  sfzmhm: string | null;

  @Column("varchar", { name: "sjhm", nullable: true, unique: true, length: 20 })
  sjhm: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Column("varchar", { name: "pwd", nullable: true, length: 255 })
  pwd: string | null;

  @Column("varchar", {
    name: "unionid",
    nullable: true,
    unique: true,
    length: 255
  })
  unionid: string | null;

  @Column("varchar", {
    name: "openid",
    nullable: true,
    unique: true,
    length: 255
  })
  openid: string | null;

  @Column("varchar", { name: "pubopenid", nullable: true, length: 255 })
  pubopenid: string | null;

  @Column("int", { name: "dwid", nullable: true })
  dwid: number | null;

  @Column("varchar", { name: "dwbm", nullable: true, length: 20 })
  dwbm: string | null;

  @Column("varchar", { name: "dwmc", nullable: true, length: 255 })
  dwmc: string | null;

  @Column("varchar", { name: "qxlx", nullable: true, length: 10 })
  qxlx: string | null;

  @Column("json", { name: "qxs", nullable: true })
  qxs: object | null;

  @Column("varchar", { name: "retask", nullable: true, length: 50 })
  retask: string | null;

  @Column("varchar", { name: "fastmenus", nullable: true, length: 2000 })
  fastmenus: string | null;

  @Column("varchar", { name: "state", nullable: true, length: 10 })
  state: string | null;

  @Column("varchar", { name: "createlx", nullable: true, length: 255 })
  createlx: string | null;

  @Column("int", { name: "drvid", nullable: true, unique: true })
  drvid: number | null;

  @OneToMany(
    () => Messages,
    messages => messages.from
  )
  messages: Messages[];

  @ManyToOne(
    () => Unit,
    unit => unit.sysusers,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "dwid", referencedColumnName: "id" }])
  dw: Unit;

  @OneToOne(
    () => Drv,
    drv => drv.sysuser,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "drvid", referencedColumnName: "id" }])
  drv: Drv;
}
