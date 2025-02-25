
import { IResolvers } from '@graphql-tools/utils';
import pool from '../db';


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
            const [rows]:any = await pool.query("SELECT COUNT (*) AS count FROM persons");
            return rows[0].count;
        },
        allPersons: async (): Promise<Person[]> => {
            const [rows]: any = await pool.query("SELECT * FROM persons");
            return rows as Person[];
        },
        findPerson: async (_, args: { name: string}): Promise<Person | null> => {
            const [rows]: any = await pool.query("SELECT * FROM persons WHERE name = ?", [args.name])
            const persons = rows as Person[];
            return persons.length > 0 ? persons[0] : null;
        }
    }
};

export default resolvers