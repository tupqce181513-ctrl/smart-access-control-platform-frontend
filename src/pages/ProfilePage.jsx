import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { changePassword as changePasswordApi } from '../api/userApi';
import { useAuth } from '../hooks/useAuth';

function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    setProfileForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  }, [user?.email, user?.fullName, user?.phone]);

  const initials = useMemo(() => {
    const source = (profileForm.fullName || profileForm.email || 'U').trim();
    const parts = source.split(' ').filter(Boolean);

    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return source.charAt(0).toUpperCase();
  }, [profileForm.email, profileForm.fullName]);

  const validateProfile = () => {
    const errors = {};

    if (!profileForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (profileForm.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }

    if (!passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm new password';
    } else if (passwordForm.confirmNewPassword !== passwordForm.newPassword) {
      errors.confirmNewPassword = 'Confirm password does not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!validateProfile()) {
      return;
    }

    setProfileLoading(true);

    try {
      await updateProfile({
        fullName: profileForm.fullName.trim(),
        phone: profileForm.phone.trim() || undefined,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setPasswordLoading(true);

    try {
      await changePasswordApi(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setPasswordErrors({});
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to change password';
      setPasswordErrors((prev) => ({ ...prev, server: message }));
      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
        <div className="mb-5 flex items-center gap-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white dark:bg-blue-500">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile Info</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information.</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleProfileSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              value={profileForm.fullName}
              onChange={(event) =>
                setProfileForm((prev) => ({
                  ...prev,
                  fullName: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
            {profileErrors.fullName ? (
              <p className="mt-1 text-xs text-red-500">{profileErrors.fullName}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              value={profileForm.email}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              value={profileForm.phone}
              onChange={(event) =>
                setProfileForm((prev) => ({
                  ...prev,
                  phone: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {profileLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Change Password</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your account password securely.</p>

        <form className="mt-4 space-y-4" onSubmit={handlePasswordSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
            {passwordErrors.currentPassword ? (
              <p className="mt-1 text-xs text-red-500">{passwordErrors.currentPassword}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
            {passwordErrors.newPassword ? (
              <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="confirmNewPassword">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              value={passwordForm.confirmNewPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmNewPassword: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
            {passwordErrors.confirmNewPassword ? (
              <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmNewPassword}</p>
            ) : null}
          </div>

          {passwordErrors.server ? <p className="text-sm text-red-500">{passwordErrors.server}</p> : null}

          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default ProfilePage;
