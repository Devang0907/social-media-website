const { ApolloServer, gql, ApolloError, UserInputError } = require('apollo-server');
const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin'); // Firebase Admin SDK


// Mock data for posts and users
let posts = [
  { id: '1', content: 'A man who herds and tends cattle on a ranch, especially in the western U.S., and who traditionally goes about most of his work on horseback. a man who exhibits the skills attributed to such cowboys, especially in rodeos.', image: '/public/image1.jpg', userId: '1', isFollowing: true },
];

let users = [
  { id: '1', username: 'user1', email: 'user1@example.com', following: ['2'] },
  { id: '2', username: 'user2', email: 'user2@example.com', following: [] },
];

// Define your type definitions (schema)
const typeDefs = gql`
  type Post {
    id: ID!
    content: String!
    image: String
    userId: ID!
    isFollowing: Boolean!
    user: User!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    following: [ID!]!
  }

  type Query {
    posts(cursor: String): [Post]
    user(id: ID!): User
    newsFeed: [Post]
    userPosts(userId: ID!): [Post]
  }

  type Mutation {
    followUser(userId: ID!): MutationResponse
    unfollowUser(userId: ID!): MutationResponse
    createPost(content: String!, image: String, userId: ID!): Post
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }
`;

// Firebase Authentication Middleware
const authenticateUser = async (authHeader) => {
  if (!authHeader) throw new UserInputError('Authorization header is missing');
  const token = authHeader.split('Bearer ')[1];
  if (!token) throw new UserInputError('Invalid authorization format');

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new ApolloError('Invalid or expired token');
  }
};

// Define your resolvers
const resolvers = {
  Query: {
    posts: async (_, { cursor }) => {
      try {
        return posts;
      } catch (error) {
        throw new ApolloError('Failed to fetch posts');
      }
    },
    user: async (_, { id }) => {
      try {
        return users.find(user => user.id === id);
      } catch (error) {
        throw new UserInputError('User not found');
      }
    },
    newsFeed: async () => {
      try {
        return posts;
      } catch (error) {
        throw new ApolloError('Failed to fetch news feed');
      }
    },
    userPosts: async (_, { userId }) => {
      try {
        return posts.filter(post => post.userId === userId);
      } catch (error) {
        throw new ApolloError('Failed to fetch user posts');
      }
    },
  },
  Mutation: {
    followUser: async (_, { userId }, { req }) => {
      try {
        const decodedToken = await authenticateUser(req.headers.authorization);
        const currentUser = users.find(user => user.id === decodedToken.uid);

        if (!currentUser) throw new UserInputError('User not found');
        if (currentUser.following.includes(userId)) throw new UserInputError('Already following this user');

        currentUser.following.push(userId);
        return { success: true, message: 'User followed successfully' };
      } catch (error) {
        throw new ApolloError(error.message || 'Failed to follow user');
      }
    },
    unfollowUser: async (_, { userId }, { req }) => {
      try {
        const decodedToken = await authenticateUser(req.headers.authorization);
        const currentUser = users.find(user => user.id === decodedToken.uid);

        if (!currentUser) throw new UserInputError('User not found');
        currentUser.following = currentUser.following.filter(id => id !== userId);
        return { success: true, message: 'User unfollowed successfully' };
      } catch (error) {
        throw new ApolloError(error.message || 'Failed to unfollow user');
      }
    },
    createPost: async (_, { content, image, userId }) => {
      try {
        const newPost = { id: String(posts.length + 1), content, image, userId, isFollowing: false };
        posts.push(newPost);
        return newPost;
      } catch (error) {
        throw new ApolloError('Failed to create post');
      }
    },
  },
  Post: {
    user: (post) => users.find(user => user.id === post.userId),
  },
};

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }), // Pass request to context for authentication
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
}).catch(error => {
  console.error('Error starting the server:', error);
});
