import React, { useState } from 'react';
import { Save, MapPin, Clock, Eye, EyeOff, Camera, Upload, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileTab: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    skillsOffered: user?.skillsOffered.join(', ') || '',
    skillsWanted: user?.skillsWanted.join(', ') || '',
    availability: user?.availability.join(', ') || '',
    isProfilePublic: user?.isProfilePublic ?? true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setProfilePhoto(result);
        setShowPhotoUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto('');
    setShowPhotoUpload(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedData = {
        name: formData.name,
        location: formData.location || undefined,
        profilePhoto: profilePhoto || undefined,
        skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
        skillsWanted: formData.skillsWanted.split(',').map(s => s.trim()).filter(Boolean),
        availability: formData.availability.split(',').map(s => s.trim()).filter(Boolean),
        isProfilePublic: formData.isProfilePublic,
      };

      updateProfile(updatedData);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          {/* Profile Photo Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profile Photo
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                {profilePhoto && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoUpload(true)}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>{profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
                <p className="text-xs text-gray-500">
                  JPG, PNG up to 5MB
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Mumbai, Delhi"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills You Offer (comma-separated)
              </label>
              <textarea
                name="skillsOffered"
                value={formData.skillsOffered}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., React, JavaScript, Photoshop, Excel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills You Want to Learn (comma-separated)
              </label>
              <textarea
                name="skillsWanted"
                value={formData.skillsWanted}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Python, Machine Learning, UI Design"
              />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              When are you available? (comma-separated)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                rows={2}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Weekends, Evenings, Mornings, Weekdays"
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isProfilePublic"
              name="isProfilePublic"
              checked={formData.isProfilePublic}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isProfilePublic" className="flex items-center text-sm font-medium text-gray-700">
              {formData.isProfilePublic ? (
                <Eye className="h-4 w-4 mr-2 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 mr-2 text-gray-600" />
              )}
              Make my profile public (visible to other users)
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            When enabled, other users can find and contact you for skill swaps.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {saveMessage && (
              <p className={`text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {saveMessage}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Profile Photo</h3>
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Choose a photo to upload</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Select Photo</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 5MB<br />
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;