import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("query-result-cache", { schema: "pzhjj" })
export class QueryResultCache {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "identifier", nullable: true, length: 255 })
  identifier: string | null;

  @Column("bigint", { name: "time" })
  time: string;

  @Column("int", { name: "duration" })
  duration: number;

  @Column("text", { name: "query" })
  query: string;

  @Column("text", { name: "result" })
  result: string;
}
