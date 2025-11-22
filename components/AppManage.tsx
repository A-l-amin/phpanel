import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { getAppSettings, updateAppSettings } from '../services/apiService';
import { Input } from './common/Input';
import { Textarea } from './common/Textarea';
import { Button } from './common/Button';
import { Toggle } from './common/Toggle';
import { Card } from './common/Card';

export const AppPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    version: '',
    updateNotes: '',
    forceUpdate: false,
    colorTheme: '',
    appName: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const fetchedSettings = await getAppSettings();
        setSettings(fetchedSettings);
      } catch (err) {
        setError('Failed to fetch app settings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setSettings(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateAppSettings(settings);
      setSuccess('App settings updated successfully!');
    } catch (err) {
      setError('Failed to update app settings.');
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000); // Clear success message after 3 seconds
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-darkText">
        Loading App Settings...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-darkText">App</h2>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <Input
            id="appName"
            label="App Name"
            value={settings.appName}
            onChange={handleChange}
            placeholder="e.g., DX VPN Client"
            required
          />
          <Input
            id="version"
            label="Current App Version"
            value={settings.version}
            onChange={handleChange}
            placeholder="e.g., 1.0.0"
            required
          />
          <Textarea
            id="updateNotes"
            label="Update Notes"
            value={settings.updateNotes}
            onChange={handleChange}
            placeholder="Describe the latest updates and features here..."
            rows={5}
          />
          <Input
            id="colorTheme"
            label="App Color Theme"
            value={settings.colorTheme}
            onChange={handleChange}
            placeholder="e.g., dark, light, blue-neon"
          />

          <Toggle
            id="forceUpdate"
            label="Force Update"
            checked={settings.forceUpdate}
            onChange={(checked) => setSettings(prev => ({ ...prev, forceUpdate: checked }))}
            className="mt-4"
          />
          <p className="text-sm text-gray-500 mt-1 mb-4">
            If enabled, users will be forced to update to the latest version.
          </p>

          {error && <p className="text-red-500 mt-6 mb-4">{error}</p>}
          {success && <p className="text-green-500 mt-6 mb-4">{success}</p>}

          <Button type="submit" loading={saving} className="mt-8 w-full sm:w-auto">
            {saving ? 'Saving...' : 'Save App Settings'}
          </Button>
        </form>
      </Card>
    </div>
  );
};