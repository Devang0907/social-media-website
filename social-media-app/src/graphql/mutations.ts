// src/graphql/mutations.ts
import { gql } from '@apollo/client';

export const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      success
      message
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      success
      message
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($content: String!, $image: String, $userId: ID!) {
    createPost(content: $content, image: $image, userId: $userId) {
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