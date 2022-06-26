const express = require('express')
const { graphqlHTTP } = require('express-graphql');

const app = express()

const PORT = 5000

const {
    GraphQLList
  } = require('graphql')

  const {
    GraphQLSchema
  } = require('graphql')



const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull
  } = require('graphql')

const WebsiteType = new GraphQLObjectType({
    name: 'Website',
    description: 'This represents a website made by a Owner(Programmer)',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      ownerId: { type: GraphQLNonNull(GraphQLInt) },
    })
  })

  const OwnerType = new GraphQLObjectType({
    name: 'Owner',
    description: 'This represents a owner of a website',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
    })
  })

  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      websites: {
        type: new GraphQLList(WebsiteType),
        description: 'List of All Websites',
        resolve: () => Websites
      },
      owners: {
        type: new GraphQLList(OwnerType),
        description: 'List of All Owners',
        resolve: () => Owners
      },
      website: {
        type: WebsiteType,
        description: 'A Single Website',
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (parent, args) => Websites.find(website => website.id === args.id)
      },
      owner: {
        type: OwnerType,
        description: 'A Single Owner',
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (parent, args) => Owners.find(owner => owner.id === args.id)
      }
    })
  })


  const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      addWebsite: {
        type: WebsiteType,
        description: 'Add a website',
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          ownerId: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: (parent, args) => {
          const website = { id: Websites.length + 1, name: args.name,ownerId:args.ownerId }
          Websites.push(website)
          return website
        }
      },
      removeWebsite: {
          type: WebsiteType,
          description: 'Remove a Website',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) }
          },
          resolve: (parent, args) => {
              Websites = Websites.filter(website => website.id !== args.id)
              return Websites[args.id]
          }
        },
      addOwner: {
        type: OwnerType,
        description: 'Add an Owner',
        args: {
          name: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: (parent, args) => {
          const owner = { id: Owners.length + 1, name: args.name }
          Owners.push(owner)
          return owner
        }
      },
      removeOwner: {
          type: OwnerType,
          description: 'Remove an Owner',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) }
          },
          resolve: (parent, args) => {
              Owners = Owners.filter(owner => owner.id !== args.id)
              return Owners[args.id]
          }
        },
        updateOwner: {
          type: OwnerType,
          description: 'Update an Owner',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) },
            name:{type:new GraphQLNonNull(GraphQLString)}
          },
          resolve: (parent, args) => {
              Owners[args.id - 1].name = args.name
              return Owners[args.id - 1]
          }
        },
        updateWebsite: {
          type: WebsiteType,
          description: 'Update a Website',
          args: {
            id: { type: new GraphQLNonNull(GraphQLInt) },
            name:{type:new GraphQLNonNull(GraphQLString)},
            ownerId:{type:new GraphQLNonNull(GraphQLInt)}
          },
          resolve: (parent, args) => {
              Websites[args.id - 1].name = args.name
              Websites[args.id - 1].ownerId = args.ownerId
              return Websites[args.id - 1]
          }
        },
    })
  })

  const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
  })

var Owners = [
    { id: 1, name: 'John Astle' },
    { id: 2, name: 'Gautam Sharma' },
    { id: 3, name: 'Kane Williamson' }
]

var Websites = [
    { id: 1, name: 'Facebook', ownerId: 1 },
    { id: 2, name: 'Google', ownerId: 2 },
    { id: 3, name: 'Amazon', ownerId: 3 },
    { id: 4, name: 'Github', ownerId: 1 },
    { id: 5, name: 'Medium', ownerId: 2 },
    { id: 6, name: 'Baidu', ownerId: 3 },
    { id: 7, name: 'Zapak', ownerId: 1 },
    { id: 8, name: 'Cricinfo', ownerId: 2 }
]


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema:schema
  }))
  app.listen(8081, () => console.log('Server Running'))