const express = require('express');
const expressGraphQl = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull

} = require('graphql');

const art = [
  {id: 2, name: 'thing2', creatorId: 2},
  {id: 3, name: 'thing3', creatorId: 1},
  {id: 4, name: 'thing4', creatorId: 3},
  {id: 5, name: 'thing5', creatorId: 3},
  {id: 6, name: 'thing6', creatorId: 3}
];
const creators = [
  {id: 1, name: 'Tay'},
  {id: 2, name: 'Tyler'},
  {id: 3, name: 'Tom'},
];

const artType = new GraphQLObjectType({
  name: 'artThing',
  description: 'this represents art made by an artist',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    creatorId: { type: GraphQLNonNull(GraphQLInt)},
    creator: {
      type: creatorType,
      resolve: (art) => {
        return creators.find(creator => creator.id === art.creatorId)
      }
     }
  })
})

const creatorType = new GraphQLObjectType({
  name: 'Creator',
  description: 'this represents creator of a piece of art',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    art: {
      type: new GraphQLList(artType),
      resolve: (creator) => {
        return art.filter(art => creator.id === art.creatorId)
      }
    }
  })
})

const rootQueryType = new GraphQLObjectType({
  name: 'query',
  description: 'Root Query',
  fields: () => ({
    artPiece: { 
      type: artType,
      description: 'A single piece of art',
      args: { 
        id: {type: GraphQLInt}
      },
      resolve: (parent, args) => art.find(piece => piece.id === args.id)
     },
    art: {
      type: new GraphQLList(artType),
      description: 'List of Art',
      resolve: () => art
    },
    creator: {
      type: creatorType,
      description: 'single creator',
      args: { 
        id: {type: GraphQLInt}
      },
      resolve: (parent, args) => creators.find(creator => creator.id === args.id)
    },
    creators: {
      type: new GraphQLList(creatorType),
      description: 'List of all creators',
      resolve: () => creators
    }
  })
})

const schema = new GraphQLSchema({
  query: rootQueryType
})


const app = express();


app.use('/graphql', expressGraphQl({
  schema: schema,
  graphiql: true,
}));

app.listen(3000, () => {
  console.log('server is running')
})