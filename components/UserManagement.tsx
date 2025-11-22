import React, { useState, useEffect } from 'react';
import { User, UserLog, UserDeviceInfo } from '../types';
import { getUsers, addUser, updateUser, deleteUser, resetUserPassword, getUserLogs, getUserDevices } from '../services/apiService';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Card } from './common/Card';

// Rename component from 'User' to 'UserPage' to avoid name collision with 'User' interface
export const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [currentLogs, setCurrentLogs] = useState<UserLog[]>([]);
  const [currentDevices, setCurrentDevices] = useState<UserDeviceInfo[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setCurrentUser({ subscriptionType: 'Free', status: 'active' });
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user.');
        console.error(err);
      }
    }
  };

  const handleResetPassword = async (id: string) => {
    if (window.confirm('Are you sure you want to reset the password for this user?')) {
      try {
        await resetUserPassword(id);
        alert('Password reset initiated. User will receive instructions.');
      } catch (err) {
        setError('Failed to reset password.');
        console.error(err);
      }
    }
  };

  const handleViewLogs = async (userId: string) => {
    try {
      const logs = await getUserLogs(userId);
      setCurrentLogs(logs);
      setIsLogsModalOpen(true);
    } catch (err) {
      setError('Failed to fetch user logs.');
      console.error(err);
    }
  };

  const handleViewDevices = async (userId: string) => {
    try {
      const devices = await getUserDevices(userId);
      setCurrentDevices(devices);
      setIsDevicesModalOpen(true);
    } catch (err) {
      setError('Failed to fetch user devices.');
      console.error(err);
    }
  };

  const handleUserModalClose = () => {
    setIsUserModalOpen(false);
    setCurrentUser(null);
    setSaving(false);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.username || !currentUser?.email || !currentUser?.subscriptionType) {
      alert('Username, Email, and Subscription Type are required.');
      return;
    }
    setSaving(true);
    try {
      if (currentUser.id) {
        await updateUser(currentUser as User);
      } else {
        await addUser(currentUser as Omit<User, 'id' | 'loginHistory' | 'deviceInfo'>);
      }
      fetchUsers();
      handleUserModalClose();
    } catch (err) {
      setError('Failed to save user.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-darkText">
        Loading Users...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-darkText">User</h2>

      <div className="flex justify-end mb-6">
        <Button onClick={handleAddUser} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}>
          Add New User
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-darkBorder">
            <thead className="bg-darkBg">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Subscription
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  End Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{user.subscriptionType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{user.subscriptionEndDate || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditUser(user)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleResetPassword(user.id)}>
                      Reset Pass
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewLogs(user.id)}>
                      Logs
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewDevices(user.id)}>
                      Devices
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isUserModalOpen}
        onClose={handleUserModalClose}
        title={currentUser?.id ? 'Edit User' : 'Add New User'}
        footer={
          <Button type="submit" loading={saving} form="user-form">
            {saving ? 'Saving...' : 'Save User'}
          </Button>
        }
      >
        <form id="user-form" onSubmit={handleSaveUser}>
          <Input
            id="username"
            label="Username"
            value={currentUser?.username || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
            required
          />
          <Input
            id="email"
            label="Email"
            type="email"
            value={currentUser?.email || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            required
          />
          <div className="mb-4">
            <label htmlFor="subscriptionType" className="block text-sm font-medium leading-6 text-darkText">
              Subscription Type
            </label>
            <select
              id="subscriptionType"
              value={currentUser?.subscriptionType || 'Free'}
              onChange={(e) => setCurrentUser({ ...currentUser, subscriptionType: e.target.value as 'Free' | 'Premium' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-darkCard dark:border-darkBorder dark:text-darkText"
              required
            >
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          {currentUser?.subscriptionType === 'Premium' && (
            <Input
              id="subscriptionEndDate"
              label="Subscription End Date"
              type="date"
              value={currentUser?.subscriptionEndDate || ''}
              onChange={(e) => setCurrentUser({ ...currentUser, subscriptionEndDate: e.target.value })}
            />
          )}
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium leading-6 text-darkText">
              Status
            </label>
            <select
              id="status"
              value={currentUser?.status || 'active'}
              onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value as 'active' | 'inactive' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-darkCard dark:border-darkBorder dark:text-darkText"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isLogsModalOpen} onClose={() => setIsLogsModalOpen(false)} title={`Login History for ${currentUser?.username || 'User'}`} size="lg">
        <div className="overflow-x-auto">
          {currentLogs.length > 0 ? (
            <table className="min-w-full divide-y divide-darkBorder">
              <thead className="bg-darkBg">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkBorder">
                {currentLogs.map((log, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-darkText">{log.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-darkText">{log.ipAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-darkText">{log.device}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-darkText">{log.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-darkText">No login history available for this user.</p>
          )}
        </div>
      </Modal>

      <Modal isOpen={isDevicesModalOpen} onClose={() => setIsDevicesModalOpen(false)} title={`Device Info for ${currentUser?.username || 'User'}`} size="lg">
        <div className="overflow-x-auto">
          {currentDevices.length > 0 ? (
            <table className="min-w-full divide-y divide-darkBorder">
              <thead className="bg-darkBg">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">OS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkBorder">
                {currentDevices.map((device) => (
                  <tr key={device.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-darkText">{device.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-darkText">{device.deviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-darkText">{device.os}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-darkText">{device.lastUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-darkText">No device information available for this user.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};