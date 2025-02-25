import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schemas";
import resolvers from "./resolvers";
import dotenv from "dotenv";

dotenv.config();


async function startServer(){
    const app: Application = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    await server.start();
    server.applyMiddleware({ app: app as any });

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
        console.log(`🚀Server running on http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();