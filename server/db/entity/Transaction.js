import {Entity, Column, PrimaryGeneratedColumn, Index} from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn({type: "bigint"})
    id;

    @Column("varchar")
    blockHash;

    @Column("int")
    blockNumber;

    @Column("varchar")
    from;

    @Column("int")
    gas;

    @Column("varchar")
    gasPrice;

    @Column("varchar", { nullable : true })
    maxFeePerGas;

    @Column("varchar", { nullable : true })
    maxPriorityFeePerGas;

    @Index({ unique: true })
    @Column("varchar")
    hash;

    @Column("mediumtext")
    input;

    @Column("int")
    nonce;

    @Column("varchar", { nullable : true })
    to;

    @Column("int")
    transactionIndex;

    @Column("varchar")
    value;

    @Column("int")
    type;

    @Column("simple-array", { nullable : true })
    accessList;

    @Column("varchar", { nullable : true })
    chainId;

    @Column("varchar")
    v;

    @Column("varchar")
    r;

    @Column("varchar")
    s;
}