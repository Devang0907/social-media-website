import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag'; // Import for GraphQL (optional, if using GraphQL)
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth modular
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'; // Firebase Firestore modular
import { auth, db } from '../firebase'; // Firebase initialization (using modular SDK)

const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($userId: ID!, $followUserId: ID!) {
    followUser(userId: $userId, followUserId: $followUserId) {
      id
      isFollowing
    }
  }
`;

interface FollowButtonProps {
  userId: string; // The user ID that the logged-in user wants to follow
  isFollowing: boolean; // Whether the logged-in user is currently following this user
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, isFollowing }) => {
  const [following, setFollowing] = useState(isFollowing);
  const [currentUser, setCurrentUser] = useState<any>(null); // Store the current logged-in user

  // Get current user from Firebase Authentication using onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setCurrentUser(user); // Set current user
      console.log('Current User:', user); // Log user to debug
    });
    return () => unsubscribe();
  }, []);

  // Using GraphQL mutation (optional)
  const [followUserMutation] = useMutation(FOLLOW_USER_MUTATION);

  // Firebase Firestore follow/unfollow function
  const followUser = async (currentUserId: string, userIdToFollow: string) => {
    const currentUserRef = doc(db, 'users', currentUserId);
    const userToFollowRef = doc(db, 'users', userIdToFollow);

    const currentUserDoc = await getDoc(currentUserRef);
    const userToFollowDoc = await getDoc(userToFollowRef);

    if (currentUserDoc.exists() && userToFollowDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const isFollowing = currentUserData?.following?.includes(userIdToFollow);
      if (isFollowing) {
        // Unfollow the user
        await updateDoc(currentUserRef, {
          following: currentUserData?.following.filter((id: string) => id !== userIdToFollow),
        });
      } else {
        // Follow the user
        await updateDoc(currentUserRef, {
          following: [...(currentUserData?.following || []), userIdToFollow],
        });
      }
    }
  };

  // Handle follow button toggle
  const handleFollowToggle = async () => {
    if (!currentUser) {
      alert('You need to be logged in to follow users');
      return;
    }

    try {
      // Using GraphQL (uncomment if using GraphQL)
      await followUserMutation({
        variables: {
          userId: currentUser.uid, // Current user ID
          followUserId: userId, // The user being followed
        },
      });

      // Toggle follow state locally
      setFollowing(!following);

      // Using Firebase Firestore (uncomment if using Firestore)
      await followUser(currentUser.uid, userId);
      setFollowing(!following);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      className={`px-4 py-2 rounded-md text-sm font-semibold focus:outline-none ${
        following
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-indigo-600 border border-indigo-600'
      }`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
