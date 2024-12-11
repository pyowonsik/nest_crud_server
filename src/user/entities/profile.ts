import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { BaseTable } from "src/common/base-table.entity";

@Entity()
export class Profile extends BaseTable{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    profileImage : string;

    @OneToOne(
        () => User,
        (user) => user.profile,
    )
    user : User;
    
}