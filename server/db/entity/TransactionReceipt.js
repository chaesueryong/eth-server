import {Entity, Column, PrimaryGeneratedColumn, Index} from "typeorm";

@Entity()
export class TransactionReceipt {
    @PrimaryGeneratedColumn({type: "bigint"})
    id;

    @Column("varchar")
    blockHash;

    @Column("int")
    blockNumber;

    @Column("varchar")
    blockHash;

    @Column("varchar", { nullable: true })
    contractAddress;

    @Column("int")
    cumulativeGasUsed;

    @Column("varchar")
    effectiveGasPrice;

    @Column("varchar")
    from;

    @Column("int")
    gasUsed;

    @Column("int")
    logCount;

    @Column("text")
    logsBloom;

    @Column("varchar", { nullable: true })
    status;

    @Column("varchar", { nullable: true })
    to;

    @Index({ unique: true })
    @Column("varchar")
    transactionHash;

    @Column("int")
    transactionIndex;

    @Column("varchar")
    type;
}