import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Log {
    @PrimaryGeneratedColumn({type: "bigint"})
    id;

    @Column("varchar")
    address;

    @Column("varchar")
    blockHash;

    @Column("int")
    blockNumber;

    @Column("mediumtext")
    data;

    @Column("int")
    logIndex;

    @Column("boolean")
    removed;

    @Column("simple-array")
    topics;

    @Column("varchar")
    transactionHash;

    @Column("varchar")
    transactionIndex;
}