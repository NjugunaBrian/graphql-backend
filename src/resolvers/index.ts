
import { IResolvers } from '@graphql-tools/utils';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLError } from 'graphql';


interface Person {
    id: string;
    name: string;
    phone: string | null;
    street: string;
    city: string;

}

const resolvers: IResolvers = {
    Query: {
        personCount: async (): Promise<number> => {
            const [rows]:any = await pool.query("SELECT COUNT(*) AS count FROM persons");
            return rows[0].count;
        },
        allPersons: async (): Promise<Person[]> => {
            const [rows]: any = await pool.query("SELECT * FROM persons");
            return rows as Person[];
        },
        findPerson: async (_, args: { name: string }): Promise<Person | null> => {
            const [rows]: any = await pool.query("SELECT * FROM persons WHERE name = ?", [args.name])
            const persons = rows as Person[];
            return persons.length > 0 ? persons[0] : null;
        }
    },
    Mutation: {
        addPerson: async (_, args: { name: string, phone?: string, street: string, city: string}): Promise<Person> => {
            const { name, phone, street, city } = args;

            const [existingPersons]: any = await pool.query("SELECT * FROM persons WHERE name = ?", [name]);

            if (existingPersons.length > 0){
                throw new GraphQLError(`Person with name ${name} already exists in the database`, {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        http: { status: 400 }
                    }
                });
            }
            const id = uuidv4();

            await pool.query("INSERT INTO persons (id, name, phone, street, city) VALUES (?, ?, ?, ?, ?)", [id, name, phone || null, street, city]);

            return {
                id,
                name,
                phone: phone || null,
                street,
                city
            };
        },

        editNumber: async (_, args: { name: string, phone: string }): Promise<Person> => {
            const { name, phone } = args;

            const [persons]: any = await pool.query("SELECT * FROM persons WHERE name = ?", [name]);

            if(persons.length === 0){
                throw new GraphQLError(`Person with name ${name} not found`, {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        http: { status: 404 }
                    }
                });

            }
            //update the phone number
            await pool.query("UPDATE persons SET phone = ? WHERE name = ?", [phone, name]);
            const person  = persons[0];
            return {
                ...person,
                phone
            };

        }
    }
};

export default resolvers