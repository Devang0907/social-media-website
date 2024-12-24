// src/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_POSTS_QUERY = gql`
  query GetPosts($cursor: String) {
    posts(cursor: $cursor) {
      edges {
        id
        content
        image
        userId
        isFollowing
      }
      cursor
      hasNextPage
    }
  }
`;

export const GET_NEWS_FEED_QUERY = gql`
  query GetNewsFeed($userId: ID!) {
    newsFeed(userId: $userId) {
      id
      content
      image
      userId
      isFollowing
      user {
        id
        username
        email
      }
    }
  }
`;