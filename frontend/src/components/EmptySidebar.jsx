import { Users, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptySidebar = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <Users size={64} className="text-base-content/40 mb-4" />
      
      <h3 className="text-lg font-medium text-base-content mb-2">
        No Friends Yet
      </h3>
      
      <p className="text-sm text-base-content/60 mb-6 max-w-xs">
        Start building your network by adding friends. Only friends can message each other.
      </p>
      
      <Link 
        to="/friends" 
        className="btn btn-primary gap-2"
      >
        <UserPlus size={16} />
        Find Friends
      </Link>
      
      <div className="mt-6 text-xs text-base-content/50 max-w-xs">
        💡 Search for people you know by their name or email address
      </div>
    </div>
  );
};

export default EmptySidebar;