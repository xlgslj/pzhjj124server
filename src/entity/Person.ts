import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("person", { schema: "pzhjj" })
export class Person {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", { name: "age", nullable: true })
  age: number | null;

  @Column("json", { name: "tt", nullable: true })
  tt: object | null;

  @Column("json", { name: "yy", nullable: true })
  yy: object | null;
}
