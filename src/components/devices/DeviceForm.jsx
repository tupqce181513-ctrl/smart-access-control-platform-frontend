import { useEffect, useState } from 'react';
import { DEVICE_TYPES } from '../../utils/constants';

const initialState = {
  name: '',
  deviceType: DEVICE_TYPES.DOOR,
  serialNumber: '',
  firmwareVersion: '',
  address: '',
  description: '',
};

function DeviceForm({ device = null, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!device) {
      setFormData(initialState);
      return;
    }

    setFormData({
      name: device.name || '',
      deviceType: device.deviceType || DEVICE_TYPES.DOOR,
      serialNumber: device.serialNumber || '',
      firmwareVersion: device.firmwareVersion || '',
      address: device.location?.address || '',
      description: device.location?.description || '',
    });
  }, [device]);

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Tên thiết bị là bắt buộc';
    }

    if (!formData.deviceType || !Object.values(DEVICE_TYPES).includes(formData.deviceType)) {
      nextErrors.deviceType = 'Loại thiết bị không hợp lệ';
    }

    if (!device && !formData.serialNumber.trim()) {
      nextErrors.serialNumber = 'Serial number là bắt buộc';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      deviceType: formData.deviceType,
      serialNumber: formData.serialNumber.trim(),
      firmwareVersion: formData.firmwareVersion.trim() || undefined,
      location:
        formData.address.trim() || formData.description.trim()
          ? {
              address: formData.address.trim() || undefined,
              description: formData.description.trim() || undefined,
            }
          : undefined,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="name">
          Device Name
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="deviceType">
          Device Type
        </label>
        <select
          id="deviceType"
          name="deviceType"
          value={formData.deviceType}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value={DEVICE_TYPES.DOOR}>Door</option>
          <option value={DEVICE_TYPES.GATE}>Gate</option>
          <option value={DEVICE_TYPES.LOCKER}>Locker</option>
        </select>
        {errors.deviceType ? <p className="mt-1 text-xs text-red-500">{errors.deviceType}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="serialNumber">
          Serial Number
        </label>
        <input
          id="serialNumber"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
          disabled={!!device}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:disabled:bg-gray-800"
        />
        {errors.serialNumber ? <p className="mt-1 text-xs text-red-500">{errors.serialNumber}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="firmwareVersion">
          Firmware Version
        </label>
        <input
          id="firmwareVersion"
          name="firmwareVersion"
          value={formData.firmwareVersion}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="address">
          Location Address
        </label>
        <input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          htmlFor="description"
        >
          Location Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? 'Saving...' : device ? 'Update Device' : 'Create Device'}
        </button>
      </div>
    </form>
  );
}

export default DeviceForm;
