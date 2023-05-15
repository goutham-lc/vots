import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import mongoose from "mongoose";
import UserResolver from "./backend/services/user/user.resolver";
import UserInfoResolver from "./backend/services/userinfo/userinfo.resolver";
const app: express.Application = express();
const path = "/graphql";
const PORT = 4000;

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, UserInfoResolver],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    tracing: true,
  });

  apolloServer.applyMiddleware({ app, path });

  await mongoose
    .connect(
      "mongodb+srv://vots:Vots@2023@cluster0.kxyzmqn.mongodb.net/test?retryWrites=true&w=majority&ssl=true",
      {
        useNewUrlParser: true,
        useFindAndModify: false,
      }
    )
    .catch((err) => {
      console.log("Error connecting to mongo : ", err);
      throw new Error("Error connecting to mongo : " + err);
    });
  app.listen(PORT, () => {
    console.log(`🚀 started http://localhost:${PORT}${path}`);
  });
};

main();
