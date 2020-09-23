const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
    createdAt: String
  }
  type Photo {
    id: ID
    category: Category
    src: String
    user: User
    likes: Int
    usersLiked: [User]
  }
  type Category {
    id: ID
    name: String
    emoji: String
    cover: String
  }

  input PhotoInput {
    category: ID!
    src: String!
  }

  input CategoryInput {
    name: String!
    emoji: String
    cover: String!
  }

  type Query {
    # User
    getUser: User
    # Photos
    getPhotos: [Photo]
    getPhotosByCategory(id: ID!): [Photo]
    getPhoto(id: ID!): Photo
    getLikedPhotos: [Photo]
    # Categories
    getCategories: [Category]
  }

  type Mutation {
    # Photos
    createPhoto(input: PhotoInput!): Photo
    #updatePhoto(input: PhotoInput!): Photo
    likePhoto(id: ID!): Photo
    unlikePhoto(id: ID!): Photo
    # Categories
    createCategory(input: CategoryInput!): Category
    #updateCategory(input: CategoryInput!): Category
  }
`;

module.exports = typeDefs;
