import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// GraphQL mutation to create a new post
const CREATE_POST_MUTATION = gql`
  mutation CreatePost($content: String!, $image: String, $userId: ID!) {
    createPost(content: $content, image: $image, userId: $userId) {
      id
      content
      image
      userId
      isFollowing
    }
  }
`;

const CreatePostPage = ({ userId }: { userId: string }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [createPost] = useMutation(CREATE_POST_MUTATION);

  // Initialize the navigate function
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { } = await createPost({
        variables: {
          content,
          image,
          userId,
        },
      });
      // After post is created, clear the form
      setContent('');
      setImage(null);
      // Optionally, trigger a refetch or update your local cache to show the new post
      alert('Post created successfully!');
      
      // Redirect to the NewsFeedPage
      navigate('/news-feed'); // Redirect to the newsfeed page
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-2 mt-2"
          />
        </div>

        {image && (
          <div className="flex justify-center">
            <img src={image} alt="Preview" className="w-32 h-32 object-cover mt-4 rounded-lg" />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
