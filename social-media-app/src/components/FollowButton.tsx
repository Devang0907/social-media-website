import React, { useState } from 'react';

const FollowButton = () => {
  const [following, setFollowing] = useState(false);

  const handleFollowToggle = () => {
    setFollowing(!following);
  };

  return (
    <button
      onClick={handleFollowToggle}
      className={`px-4 py-2 text-white rounded-md shadow-md transition-all duration-200 ${
        following
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {following ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
