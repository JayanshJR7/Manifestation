import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useFriendsStore = create((set, get) => ({
  friends: [],
  receivedRequests: [],
  sentRequests: [],
  searchResults: [],
  isLoading: false,

  // Search for users
  searchUsers: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/friends/search?q=${encodeURIComponent(query)}`);
      set({ searchResults: response.data });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to search users');
    } finally {
      set({ isLoading: false });
    }
  },

  // Send friend request
  sendFriendRequest: async (targetUserId) => {
    try {
      await axiosInstance.post('/friends/request', { targetUserId });
      toast.success('Friend request sent successfully!');
      
      // Remove user from search results
      const { searchResults } = get();
      set({ 
        searchResults: searchResults.filter(user => user._id !== targetUserId)
      });
      
      // Refresh sent requests
      get().getSentRequests();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send friend request');
    }
  },

  // Get received friend requests
  getReceivedRequests: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/friends/requests/received');
      set({ receivedRequests: response.data });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to get friend requests');
    } finally {
      set({ isLoading: false });
    }
  },

  // Get sent friend requests
  getSentRequests: async () => {
    try {
      const response = await axiosInstance.get('/friends/requests/sent');
      set({ sentRequests: response.data });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to get sent requests');
    }
  },

  // Accept friend request
    acceptFriendRequest: async (senderUserId) => {
    try {
      await axiosInstance.post('/friends/request/accept', { senderUserId });
      toast.success('Friend request accepted!');

      set((state) => {
        // remove from receivedRequests
        const updatedReceived = state.receivedRequests.filter(
          (req) => req.from._id !== senderUserId
        );
        // find the accepted user
        const acceptedReq = state.receivedRequests.find(
          (req) => req.from._id === senderUserId
        );
        const acceptedUser = acceptedReq?.from;

        return {
          receivedRequests: updatedReceived,
          friends: acceptedUser ? [...state.friends, acceptedUser] : state.friends,
        };
      });

      // optional: re-sync with backend
      get().getFriends();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to accept friend request');
    }
  },


  // Reject friend request
    rejectFriendRequest: async (senderUserId) => {
    try {
      await axiosInstance.post('/friends/request/reject', { senderUserId });
      toast.success('Friend request rejected');

      set((state) => ({
        receivedRequests: state.receivedRequests.filter(
          (req) => req.from._id !== senderUserId
        ),
      }));

      // optional: re-sync
      get().getReceivedRequests();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject friend request');
    }
  },


  // Get friends list
  getFriends: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/friends/list');
      set({ friends: response.data });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to get friends list');
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove friend
  removeFriend: async (friendId) => {
    try {
      await axiosInstance.delete('/friends/remove', { data: { friendId } });
      toast.success('Friend removed successfully');

      set((state) => ({
        friends: state.friends.filter((f) => f._id !== friendId),
      }));

      // optional: re-sync
      get().getFriends();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to remove friend');
    }
  },


  // Clear search results
  clearSearchResults: () => {
    set({ searchResults: [] });
  },

  // Initialize friends data
  initializeFriendsData: () => {
    get().getFriends();
    get().getReceivedRequests();
    get().getSentRequests();
  }
}));