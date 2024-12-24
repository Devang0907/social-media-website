import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import FollowButton from '../components/FollowButton';

// GraphQL query to fetch the news feed
const GET_NEWS_FEED_QUERY = gql`
  query GetNewsFeed {
    newsFeed {
      id
      content
      image
      userId
      isFollowing
    }
  }
`;

const NewsFeedPage: React.FC = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_NEWS_FEED_QUERY);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const fetchMorePosts = () => {
    // Implement fetch more logic if needed
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prevLikedPosts) => {
      const updatedLikedPosts = new Set(prevLikedPosts);
      if (updatedLikedPosts.has(postId)) {
        updatedLikedPosts.delete(postId);
      } else {
        updatedLikedPosts.add(postId);
      }
      return updatedLikedPosts;
    });
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="mb-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800">News Feed</h1>
        <Link
          to="/create-post"
          className="inline-block mt-4 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          Create Post
        </Link>
      </div>
      <InfiniteScroll
        dataLength={data.newsFeed.length}
        next={fetchMorePosts}
        hasMore={false} // Set to true if implementing pagination
        loader={<p className="text-center text-gray-500">Loading more posts...</p>}
        className="w-full max-w-md"
      >
        {data.newsFeed.map((post: any) => (
          <div
            key={post.id}
            className="p-4 mb-6 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-center"
          >
            <p className="text-gray-800 mb-4 text-center">{post.content}</p>
            {post.image && (
              <div className="mb-4 w-full">
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}
            <div className="flex items-center justify-between w-full">
              <FollowButton userId={post.userId} isFollowing={post.isFollowing} />
              <button
                onClick={() => toggleLike(post.id)}
                className={`focus:outline-none ${likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                aria-label="Like Post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={likedPosts.has(post.id) ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default NewsFeedPage;
