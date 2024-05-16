const { gql } = require('@apollo/server');  //to parse GraphQL schema strings into an executable schema object
// Définir le schéma GraphQL
const typeDefs = `#graphql

type episode {
    _id: ID!
    title: String!
    description: String!    
}

type video {
    id: ID!
    title: String!
    description: String!
}

type Query {
    episode(id: String!): episode
    episodes: [episode]
    video(id: String!): video
    videos: [video]
}

type Mutation {
    addepisode(title: String!, description: String!): episode!
    addvideo(title: String!, description: String!): video!
}
`;
module.exports = typeDefs