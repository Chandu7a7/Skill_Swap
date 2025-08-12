import React, { useState } from 'react';
import {
  Save,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  Camera,
  Upload,
  X,
  User as UserIcon,
  Shield,
  Settings,
} from 'lucide-react';
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
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
        skillsOffered: formData.skillsOffered
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        skillsWanted: formData.skillsWanted
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        availability: formData.availability
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        isProfilePublic: formData.isProfilePublic,
      };

      await updateProfile(updatedData); // Await async updateProfile call

      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-indigo-200 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center">
          Profile Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <section className="rounded-xl p-6 border border-indigo-200">
            <h3 className="text-xl font-semibold text-indigo-800 mb-6 flex items-center gap-3">
              <UserIcon className="h-6 w-6 text-indigo-600" />
              Basic Information
            </h3>

            {/* Profile Photo */}
            <div className="mb-8 flex items-center space-x-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border border-indigo-300 shadow-sm">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-10 w-10 text-indigo-400" />
                  )}
                </div>
                {profilePhoto && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 shadow-md"
                    aria-label="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col space-y-3 flex-grow max-w-xs">
                <button
                  type="button"
                  onClick={() => setShowPhotoUpload(true)}
                  className="flex items-center justify-center space-x-3 bg-indigo-600 text-white px-5 py-3 rounded-lg text-base font-semibold hover:bg-indigo-700 transition"
                >
                  <Upload className="h-5 w-5" />
                  <span>{profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
                <p className="text-sm text-indigo-600">
                  JPG, PNG up to 5MB
                </p>
              </div>
            </div>

            {/* Name input */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-indigo-900"
              />
            </div>

            {/* Location input */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Location (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-indigo-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Mumbai, Delhi"
                  className="w-full pl-14 pr-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-indigo-900"
                />
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="rounded-xl p-6 border border-indigo-200">
            <h3 className="text-xl font-semibold text-indigo-800 mb-6 flex items-center gap-3">
              <Settings className="h-6 w-6 text-indigo-600" />
              Skills
            </h3>

            {/* Skills Offered */}
            <div className="mb-6">
              <label
                htmlFor="skillsOffered"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Skills You Offer (comma-separated)
              </label>
              <textarea
                id="skillsOffered"
                name="skillsOffered"
                value={formData.skillsOffered}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g., React, JavaScript, Photoshop, Excel"
                className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-indigo-900"
              />
            </div>

            {/* Skills Wanted */}
            <div>
              <label
                htmlFor="skillsWanted"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Skills You Want to Learn (comma-separated)
              </label>
              <textarea
                id="skillsWanted"
                name="skillsWanted"
                value={formData.skillsWanted}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g., Python, Machine Learning, UI Design"
                className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-indigo-900"
              />
            </div>
          </section>

          {/* Availability Section */}
          <section className="rounded-xl p-6 border border-indigo-200">
            <h3 className="text-xl font-semibold text-indigo-800 mb-6 flex items-center gap-3">
              <Clock className="h-6 w-6 text-indigo-600" />
              Availability
            </h3>

            <div>
              <label
                htmlFor="availability"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                When are you available? (comma-separated)
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-4 h-6 w-6 text-indigo-400" />
                <textarea
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="e.g., Weekends, Evenings, Mornings, Weekdays"
                  className="w-full pl-14 pr-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-indigo-900"
                />
              </div>
            </div>
          </section>

          {/* Privacy Settings */}
          <section className="rounded-xl p-6 border border-indigo-200">
            <h3 className="text-xl font-semibold text-indigo-800 mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 text-indigo-600" />
              Privacy Settings
            </h3>

            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="isProfilePublic"
                name="isProfilePublic"
                checked={formData.isProfilePublic}
                onChange={handleInputChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-indigo-300 rounded cursor-pointer"
              />
              <label
                htmlFor="isProfilePublic"
                className="flex items-center text-base font-medium text-indigo-800 cursor-pointer select-none"
              >
                {formData.isProfilePublic ? (
                  <Eye className="h-5 w-5 mr-2 text-green-600" />
                ) : (
                  <EyeOff className="h-5 w-5 mr-2 text-indigo-400" />
                )}
                Make my profile public (visible to other users)
              </label>
            </div>
            <p className="mt-3 text-sm text-indigo-600">
              When enabled, other users can find and contact you for skill swaps.
            </p>
          </section>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-indigo-300">
            {saveMessage && (
              <p
                className={`text-base ${
                  saveMessage.includes('Error')
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {saveMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="h-5 w-5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-indigo-900 bg-opacity-75 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-indigo-900">
                  Upload Profile Photo
                </h3>
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="text-indigo-700 hover:text-indigo-900 transition-colors"
                  aria-label="Close upload modal"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>

              <div className="border-2 border-dashed border-indigo-300 rounded-xl p-10 text-center">
                <Camera className="h-16 w-16 text-indigo-400 mx-auto mb-6" />
                <p className="text-indigo-700 mb-6 text-lg font-medium">
                  Choose a photo to upload
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center justify-center space-x-3 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-xl px-6 py-3 font-semibold cursor-pointer select-none"
                >
                  <Upload className="h-6 w-6" />
                  <span>Select Photo</span>
                </label>
                <p className="text-indigo-600 mt-4 text-sm">
                  Maximum file size: 5MB
                  <br />
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
