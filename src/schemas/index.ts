import { gql } from "apollo-server";

const typeDefs =gql`
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
    }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person    
   }

   type Mutation {
    addPerson(
        name: String!
        phone: String
        street: String!
        city: String!
    ): Person
    editNumber(
        name: String!
        phone: String!
    ): Person
   }
`;

export default typeDefs;