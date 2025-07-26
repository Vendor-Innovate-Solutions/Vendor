"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/utils/icp-api';
import { isAuthenticated, getCurrentUser } from '@/utils/icp-auth';

const ProfileTab = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    is_staff: false,
    groups: [],
  });

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/authentication');
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          throw new Error('No authenticated user found. Please log in again.');
        }

        // Get user details using ICP service
        const userData = await userService.getUserById(currentUser.id || 1);
        if (userData) {
          setUserDetails({
            username: userData.username || currentUser.username || '',
            email: userData.email || currentUser.email || '',
            is_staff: userData.userType?.admin !== undefined || false,
            groups: userData.groups || [],
          });
        } else {
          // Fallback to current user data
          setUserDetails({
            username: currentUser.username || '',
            email: currentUser.email || '',
            is_staff: currentUser.userType?.admin !== undefined || false,
            groups: [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        // Fallback to current user data if API fails
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUserDetails({
            username: currentUser.username || '',
            email: currentUser.email || '',
            is_staff: currentUser.userType?.admin !== undefined || false,
            groups: [],
          });
        }
      }
    };

    if (isAuthenticated()) {
      fetchUserDetails();
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between max-w-[1600px] mx-auto">
            <div className="text-xl font-bold">Manufacturer Details</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 max-w-[1600px] mx-auto">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Username</h3>
            <p className="text-white">{userDetails.username}</p>

            <h3 className="text-gray-400 mb-2 mt-4">Email</h3>
            <p className="text-white">{userDetails.email}</p>

            <h3 className="text-gray-400 mb-2 mt-4">Staff Status</h3>
            <p className="text-white">{userDetails.is_staff ? 'Yes' : 'No'}</p>

            <h3 className="text-gray-400 mb-2 mt-4">Groups</h3>
            <p className="text-white">{userDetails.groups.join(', ')}</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfileTab;