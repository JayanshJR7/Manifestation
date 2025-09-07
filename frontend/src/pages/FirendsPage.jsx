


import { useState, useEffect } from 'react';
import { useFriendsStore } from '../Store/useFriendsStore';
import { Search, UserPlus, Users, Clock, Check, X, Trash2, RefreshCw } from 'lucide-react';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    friends,
    receivedRequests,
    sentRequests,
    searchResults,
    isLoading,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    clearSearchResults,
    initializeFriendsData
  } = useFriendsStore();

  useEffect(() => {
    initializeFriendsData();
  }, [initializeFriendsData]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      console.log('Searching for:', query);
      searchUsers(query);
    } else {
      clearSearchResults();
    }
  };

  const handleQuickSearch = (term) => {
    setSearchQuery(term);
    searchUsers(term);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearchResults();
  };

  const renderTabButton = (tabId, label, icon, count = null) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === tabId
          ? 'bg-base-300 text-base-content'
          : 'text-base-content/70 hover:bg-base-200'
      }`}
    >
      {icon}
      {label}
      {count !== null && (
        <span className="bg-primary text-primary-content text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  const renderSearchTab = () => (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Friends</h1>
        <p className="text-base-content/60">Search for users by name or email address</p>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-base-content/40" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Type a name or email to search... (e.g., 'john' or 'user@example.com')"
            className="block w-full pl-12 pr-12 py-4 text-lg border-2 border-base-300 rounded-xl bg-base-100 placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            autoFocus
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {searchQuery.trim() && (
              <button
                onClick={handleClearSearch}
                className="text-base-content/40 hover:text-base-content mr-2"
                title="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
        
        {/* Search status */}
        <div className="text-center mt-3">
          <p className="text-sm text-base-content/60">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="loading loading-spinner loading-sm"></div>
                Searching...
              </span>
            ) : searchQuery.trim() ? (
              `Showing results for "${searchQuery}"`
            ) : (
              'Start typing to search for users'
            )}
          </p>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Search Results
              {!isLoading && (
                <span className="text-base-content/60 font-normal ml-2">
                  ({searchResults.length} found)
                </span>
              )}
            </h3>
            <button
              onClick={handleClearSearch}
              className="btn btn-ghost btn-sm"
            >
              Clear Search
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="loading loading-spinner loading-lg mb-4"></div>
              <p className="text-base-content/60">Searching for users...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search size={64} className="mx-auto text-base-content/30 mb-4" />
              <h4 className="text-lg font-medium mb-2">No users found</h4>
              <p className="text-base-content/60 mb-6">
                No users found matching "{searchQuery}". Try a different search term.
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => handleQuickSearch('a')}
                  className="btn btn-primary"
                >
                  Show All Users
                </button>
                <button
                  onClick={handleClearSearch}
                  className="btn btn-outline"
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {searchResults.map(user => {
                const isFriend = friends.some(friend => friend._id === user._id);
                const hasReceivedRequest = receivedRequests.some(req => req.from._id === user._id);
                const hasSentRequest = sentRequests.some(req => req.to._id === user._id);
                
                return (
                  <div key={user._id} className="flex items-center justify-between p-4 bg-base-200 rounded-xl border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full">
                          <img 
                            src={user.profilePic || '/avatar.png'} 
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{user.fullName}</h4>
                        <p className="text-sm text-base-content/60">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      {isFriend ? (
                        <div className="badge badge-success">Already Friends</div>
                      ) : hasReceivedRequest ? (
                        <div className="badge badge-warning">Request Received</div>
                      ) : hasSentRequest ? (
                        <div className="badge badge-info">Request Sent</div>
                      ) : (
                        <button
                          onClick={() => sendFriendRequest(user._id)}
                          className="btn btn-primary btn-sm"
                        >
                          <UserPlus size={16} />
                          Add Friend
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderFriendsTab = () => (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">My Friends</h1>
        <p className="text-base-content/60">
          {friends.length === 0 ? "You haven't added any friends yet" : `You have ${friends.length} friend${friends.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {friends.length === 0 ? (
        <div className="text-center py-12">
          <Users size={64} className="mx-auto text-base-content/30 mb-6" />
          <h3 className="text-xl font-semibold mb-2">No friends yet</h3>
          <p className="text-base-content/60 mb-6">Start by finding and adding some friends!</p>
          <button
            onClick={() => setActiveTab('search')}
            className="btn btn-primary btn-lg"
          >
            <UserPlus size={20} />
            Find Friends
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {friends.map(friend => (
            <div key={friend._id} className="flex items-center justify-between p-4 bg-base-200 rounded-xl border">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full">
                    <img 
                      src={friend.profilePic || '/avatar.png'} 
                      alt={friend.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">{friend.fullName}</h4>
                  <p className="text-sm text-base-content/60">{friend.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to remove ${friend.fullName} from your friends?`)) {
                    removeFriend(friend._id);
                  }
                }}
                className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRequestsTab = () => (
    <div className="max-w-4xl mx-auto space-y-8 mt-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Friend Requests</h1>
        <p className="text-base-content/60">Manage your incoming and outgoing friend requests</p>
      </div>

      {/* Received Requests */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Received Requests ({receivedRequests.length})
        </h2>
        {receivedRequests.length === 0 ? (
          <div className="text-center py-8 bg-base-200 rounded-xl">
            <Clock size={48} className="mx-auto text-base-content/30 mb-4" />
            <p className="text-base-content/60">No pending friend requests</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {receivedRequests.map(request => (
              <div key={request._id} className="flex items-center justify-between p-4 bg-base-200 rounded-xl border">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      <img 
                        src={request.from.profilePic || '/avatar.png'} 
                        alt={request.from.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">{request.from.fullName}</h4>
                    <p className="text-sm text-base-content/60">{request.from.email}</p>
                    <p className="text-xs text-base-content/40">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptFriendRequest(request.from._id)}
                    className="btn btn-success btn-sm"
                  >
                    <Check size={16} />
                    Accept
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(request.from._id)}
                    className="btn btn-error btn-sm"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Requests */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Sent Requests ({sentRequests.length})
        </h2>
        {sentRequests.length === 0 ? (
          <div className="text-center py-8 bg-base-200 rounded-xl">
            <Clock size={48} className="mx-auto text-base-content/30 mb-4" />
            <p className="text-base-content/60">No pending sent requests</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sentRequests.map(request => (
              <div key={request._id} className="flex items-center justify-between p-4 bg-base-200 rounded-xl border">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      <img 
                        src={request.to.profilePic || '/avatar.png'} 
                        alt={request.to.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">{request.to.fullName}</h4>
                    <p className="text-sm text-base-content/60">{request.to.email}</p>
                    <p className="text-xs text-base-content/40">
                      Sent on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-base-content/60">
                  <Clock size={16} />
                  <span className="text-sm font-medium">Pending</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100">
      <div className="flex h-screen max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-80 bg-base-200 p-6 border-r border-base-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Friends</h2>
            <p className="text-base-content/60 mt-1">Connect with people</p>
          </div>
          
          <nav className="space-y-2">
            {renderTabButton('search', 'Find Friends', <Search size={20} />)}
            {renderTabButton('friends', 'My Friends', <Users size={20} />, friends.length)}
            {renderTabButton('requests', 'Requests', <Clock size={20} />, receivedRequests.length)}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {activeTab === 'search' && renderSearchTab()}
            {activeTab === 'friends' && renderFriendsTab()}
            {activeTab === 'requests' && renderRequestsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;