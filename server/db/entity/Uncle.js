import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Uncle {
    @PrimaryGeneratedColumn({type: "bigint"})
    id;

    @Column("varchar")
    difficulty;

    @Column("varchar")
    extraData;

    @Column("int")
    gasLimit;

    @Column("int")
    gasUsed;

    @Column("varchar")
    hash;

    @Column("text")
    logsBloom;

    @Column("varchar")
    miner;

    @Column("varchar")
    mixHash;

    @Column("varchar")
    nonce;

    @Column("int")
    number;

    @Column("varchar")
    parentHash;

    @Column("varchar", { nullable : true })
    receiptsRoot;

    @Column("varchar")
    sha3Uncles;

    @Column("int")
    size;

    @Column("varchar")
    stateRoot;

    @Column("int")
    timestamp;

    @Column("varchar", { nullable : true })
    transactionsRoot;

    @Column("int")
    unclePosition;

    @Column("simple-array")
    uncles;

    @Column("int")
    blockNumber;
}