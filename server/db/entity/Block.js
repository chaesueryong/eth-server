import {Entity, Column, OneToMany, PrimaryColumn, Index} from "typeorm";

@Entity()
export class Block {
    @PrimaryColumn("int")
    id;

    @Column("int")
    blockNumber;

    @Column("int")
    timestamp;

    @Column("simple-array")
    transactions;

    @Column("varchar")
    miner;

    @Column("int", { nullable : true })
    blockReward;

    @Column("int", { nullable : true })
    unclesReward;

    @Column("varchar")
    difficulty;

    @Column("varchar")
    totalDifficulty;

    @Column("int")
    size;

    @Column("int")
    gasUsed;

    @Column("int")
    gasLimit;

    @Column("varchar", { nullable : true })
    baseFeePerGas;

    @Column("varchar", { nullable : true })
    burntFees;

    @Column("varchar")
    extraData;

    @Index({ unique: true })
    @Column("varchar")
    hash;

    @Column("varchar")
    parentHash;

    @Column("varchar")
    sha3Uncles;

    @Column("varchar")
    stateRoot;

    @Column("varchar")
    nonce;

    @Column("text")
    logsBloom;

    @Column("varchar")
    mixHash;

    @Column("varchar", { nullable : true })
    receiptsRoot;

    @Column("varchar", { nullable : true })
    transactionsRoot;

    @Column("simple-array")
    uncles;
}