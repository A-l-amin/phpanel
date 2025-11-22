import React, { useState, useEffect } from 'react';
import { Subscription, ProtocolType } from '../types';
import { getSubscriptions, addSubscription, updateSubscription, deleteSubscription } from '../services/apiService';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Card } from './common/Card';
import { PROTOCOL_OPTIONS, SUBSCRIPTION_DURATIONS } from '../constants';

// Rename component from 'Subscription' to 'SubscriptionPage' to avoid name collision with 'Subscription' interface
export const SubscriptionPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Partial<Subscription> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const fetchedSubscriptions = await getSubscriptions();
      setSubscriptions(fetchedSubscriptions);
    } catch (err) {
      setError('Failed to fetch subscriptions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = () => {
    setCurrentSubscription({
      name: '',
      duration: '7 days',
      price: 0,
      connectionLimit: 1,
      allowedProtocols: [],
    });
    setIsModalOpen(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setCurrentSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDeleteSubscription = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteSubscription(id);
        fetchSubscriptions();
      } catch (err) {
        setError('Failed to delete subscription.');
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentSubscription(null);
    setSaving(false);
  };

  const handleProtocolChange = (protocol: ProtocolType, checked: boolean) => {
    setCurrentSubscription(prev => {
      if (!prev) return prev;
      const currentProtocols = new Set(prev.allowedProtocols || []);
      if (checked) {
        currentProtocols.add(protocol);
      } else {
        currentProtocols.delete(protocol);
      }
      return { ...prev, allowedProtocols: Array.from(currentProtocols) };
    });
  };

  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSubscription?.name || !currentSubscription?.duration || currentSubscription.price === undefined || currentSubscription.connectionLimit === undefined) {
      alert('All fields are required.');
      return;
    }
    setSaving(true);
    try {
      const subscriptionToSave = {
        ...currentSubscription,
        allowedProtocols: currentSubscription.allowedProtocols || [],
      } as Subscription;

      if (subscriptionToSave.id) {
        await updateSubscription(subscriptionToSave);
      } else {
        await addSubscription(subscriptionToSave);
      }
      fetchSubscriptions();
      handleModalClose();
    } catch (err) {
      setError('Failed to save subscription.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-darkText">
        Loading Subscriptions...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-darkText">Subscription</h2>

      <div className="flex justify-end mb-6">
        <Button onClick={handleAddSubscription} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}>
          Add New Subscription
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-darkBorder">
            <thead className="bg-darkBg">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Connections
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Protocols
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder">
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{sub.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{sub.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">${sub.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{sub.connectionLimit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">
                    <div className="flex flex-wrap gap-1">
                      {sub.allowedProtocols.map(p => (
                        <span key={p} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                          {p.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="secondary" size="sm" onClick={() => handleEditSubscription(sub)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteSubscription(sub.id)}>
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
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={currentSubscription?.id ? 'Edit Subscription' : 'Add New Subscription'}
        footer={
          <Button type="submit" loading={saving} form="subscription-form">
            {saving ? 'Saving...' : 'Save Subscription'}
          </Button>
        }
      >
        <form id="subscription-form" onSubmit={handleSaveSubscription}>
          <Input
            id="name"
            label="Subscription Name"
            value={currentSubscription?.name || ''}
            onChange={(e) => setCurrentSubscription({ ...currentSubscription, name: e.target.value })}
            required
          />
          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium leading-6 text-darkText">
              Duration
            </label>
            <select
              id="duration"
              value={currentSubscription?.duration || '7 days'}
              onChange={(e) => setCurrentSubscription({ ...currentSubscription, duration: e.target.value as Subscription['duration'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-darkCard dark:border-darkBorder dark:text-darkText"
              required
            >
              {SUBSCRIPTION_DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <Input
            id="price"
            label="Price ($)"
            type="number"
            step="0.01"
            value={currentSubscription?.price || 0}
            onChange={(e) => setCurrentSubscription({ ...currentSubscription, price: parseFloat(e.target.value) })}
            required
          />
          <Input
            id="connectionLimit"
            label="Connection Limit"
            type="number"
            value={currentSubscription?.connectionLimit || 1}
            onChange={(e) => setCurrentSubscription({ ...currentSubscription, connectionLimit: parseInt(e.target.value) })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-darkText mb-2">
              Allowed Protocols
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PROTOCOL_OPTIONS.map(protocol => (
                <div key={protocol.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`protocol-${protocol.value}`}
                    checked={currentSubscription?.allowedProtocols?.includes(protocol.value) || false}
                    onChange={(e) => handleProtocolChange(protocol.value, e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:bg-darkBg dark:border-darkBorder dark:checked:bg-primary"
                  />
                  <label htmlFor={`protocol-${protocol.value}`} className="ml-2 text-sm text-darkText">
                    {protocol.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};