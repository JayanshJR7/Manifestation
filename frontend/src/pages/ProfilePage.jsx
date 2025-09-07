import { Camera, Mail, User, Trash2 } from 'lucide-react'
import { userAuthStore } from '../Store/useAuthStore'
import { useState } from 'react'

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, removeProfilePic } =
    userAuthStore()

  const [SelectedImg, setSelectedImg] = useState(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader() //to read the image file in string format
    reader.readAsDataURL(file)

    reader.onload = async () => {
      const base64Image = reader.result
      setSelectedImg(base64Image)
      await updateProfile({
        profilePic: base64Image,
      })
    }
  }

  // Helper function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available'
    
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid date'
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  return (
    <div>
      <div className="h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            {/* header */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* avatar upload section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <img
                  src={SelectedImg || authUser?.profilePic || '/avatar.png'}
                  alt="Profile"
                  className="size-32 rounded-full object-cover object-top border-4"
                />

                {/* Camera button */}
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200 opacity-0 group-hover:opacity-100
                    ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}
                  `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>

                {/* Trash button (only if user has a profile pic) */}
                {authUser?.profilePic && (
                  <button
                    onClick={removeProfilePic}
                    disabled={isUpdatingProfile}
                    className={`
                      absolute bottom-0 left-0
                      bg-red-600 hover:scale-105
                      p-2 rounded-full cursor-pointer 
                      transition-all duration-200 opacity-0 group-hover:opacity-100
                      ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}
                    `}
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile
                  ? 'Uploading...'
                  : 'Click the camera icon to update your photo'}
              </p>
            </div>

            {/* profile info */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.fullName}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.email}
                </p>
              </div>
            </div>

            {/* account info */}
            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>
                    {formatDate(
                      authUser?.createdAt || 
                      authUser?.created_at || 
                      authUser?.dateCreated || 
                      authUser?.joinedAt || 
                      authUser?.registeredAt
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage