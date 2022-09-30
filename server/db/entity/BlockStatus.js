import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class BlockStatus {
    @PrimaryColumn("int", { default: 0 })
    id;

    @Column("boolean", { default: false })
    isSyncBlock;

    @Column("int", { default: 0 })
    syncBlockNumber;
}