import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi } from '../../api/authApi';

function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setApiError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      await registerApi({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
      });

      const message = 'Check your email to verify';
      setSuccessMessage(message);
      toast.success(message);

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Registration failed';
      setApiError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="fullName"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 placeholder:text-gray-400 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          placeholder="John Doe"
          autoComplete="name"
        />
        {errors.fullName ? (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.fullName}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 placeholder:text-gray-400 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          placeholder="you@example.com"
          autoComplete="email"
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Phone Number (optional)
        </label>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 placeholder:text-gray-400 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          placeholder="0912345678"
          autoComplete="tel"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 placeholder:text-gray-400 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
        {errors.password ? (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 placeholder:text-gray-400 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          placeholder="Re-enter password"
          autoComplete="new-password"
        />
        {errors.confirmPassword ? (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">
            {errors.confirmPassword}
          </p>
        ) : null}
      </div>

      {apiError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {apiError}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300">
          {successMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
