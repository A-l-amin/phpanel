import React, { useState, useEffect } from 'react';
import { GeneralSystemSettings } from '../types';
import { getGeneralSettings, updateGeneralSettings } from '../services/apiService';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { Toggle } from './common/Toggle';
import { Card } from './common/Card';
import { useTheme } from '../contexts/ThemeContext';
import { fileToBase64 } from '../utils/base64';
import { SMTP_ENCRYPTION_OPTIONS } from '../constants';

// Rename component from 'Settings' to 'SettingsPage' to avoid name collision with 'Page.Settings' enum
export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<GeneralSystemSettings>({
    logoUrl: '',
    primaryColor: '#6366f1',
    accentColor: '#0ea5e9',
    apiBaseUrl: '',
    systemEmail: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { updateTheme } = useTheme();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const fetchedSettings = await getGeneralSettings();
        setSettings(fetchedSettings);
        setLogoPreview(fetchedSettings.logoUrl);
      } catch (err) {
        setError('Failed to fetch general settings.');
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

  const handleColorChange = (id: 'primaryColor' | 'accentColor', value: string) => {
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const base64 = await fileToBase64(file);
      setLogoPreview(base64);
    } else {
      setLogoFile(null);
      setLogoPreview(settings.logoUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      let finalLogoUrl = settings.logoUrl;
      if (logoFile && logoPreview) {
        // In a real app, you'd upload logoFile to a server and get a URL.
        // For this mock, we use the base64 preview as the URL.
        finalLogoUrl = logoPreview;
      }

      const settingsToSave = { ...settings, logoUrl: finalLogoUrl };
      await updateGeneralSettings(settingsToSave);
      setSettings(settingsToSave); // Update local state with the saved logo URL

      // Update theme context immediately
      updateTheme({
        primaryColor: settingsToSave.primaryColor,
        accentColor: settingsToSave.accentColor,
        logoUrl: settingsToSave.logoUrl,
      });

      setSuccess('General settings updated successfully!');
    } catch (err) {
      setError('Failed to update general settings.');
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-darkText">
        Loading General Settings...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-darkText">General Settings</h2>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold mb-4 text-darkText">Branding</h3>
          <div className="mb-4">
            <label htmlFor="logoUpload" className="block text-sm font-medium leading-6 text-darkText">
              App Logo
            </label>
            <input
              type="file"
              id="logoUpload"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-1 block w-full text-sm text-darkText
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary/20 file:text-primary
              hover:file:bg-primary/30"
            />
            {logoPreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Logo Preview:</p>
                <img src={logoPreview} alt="Logo Preview" className="h-24 w-auto rounded object-contain bg-darkBg p-2" />
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
            <div className="flex-1">
              <label htmlFor="primaryColor" className="block text-sm font-medium leading-6 text-darkText">
                Primary Color
              </label>
              <input
                type="color"
                id="primaryColor"
                value={settings.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="mt-1 h-10 w-full rounded-md border-gray-300 dark:border-darkBorder"
              />
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <label htmlFor="accentColor" className="block text-sm font-medium leading-6 text-darkText">
                Accent Color
              </label>
              <input
                type="color"
                id="accentColor"
                value={settings.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="mt-1 h-10 w-full rounded-md border-gray-300 dark:border-darkBorder"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-darkText">API & Email Configuration</h3>
          <Input
            id="apiBaseUrl"
            label="API Base URL (for Client App)"
            value={settings.apiBaseUrl}
            onChange={handleChange}
            placeholder="https://client-api.yourvpn.com"
            required
          />
          <Input
            id="systemEmail"
            label="System Email Address"
            type="email"
            value={settings.systemEmail}
            onChange={handleChange}
            placeholder="noreply@yourvpn.com"
            required
          />

          <h4 className="text-lg font-medium mt-6 mb-2 text-darkText">SMTP Settings</h4>
          <Input
            id="smtpHost"
            label="SMTP Host"
            value={settings.smtpHost}
            onChange={handleChange}
            placeholder="smtp.example.com"
            required
          />
          <Input
            id="smtpPort"
            label="SMTP Port"
            type="number"
            value={settings.smtpPort}
            onChange={handleChange}
            required
          />
          <Input
            id="smtpUsername"
            label="SMTP Username"
            value={settings.smtpUsername}
            onChange={handleChange}
            placeholder="user@example.com"
            required
          />
          <Input
            id="smtpPassword"
            label="SMTP Password"
            type="password"
            value={settings.smtpPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <div className="mb-4">
            <label htmlFor="smtpEncryption" className="block text-sm font-medium leading-6 text-darkText">
              SMTP Encryption
            </label>
            <select
              id="smtpEncryption"
              value={settings.smtpEncryption}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-darkCard dark:border-darkBorder dark:text-darkText"
              required
            >
              {SMTP_ENCRYPTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
            </select>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-darkText">System Status</h3>
          <Toggle
            id="maintenanceMode"
            label="Maintenance Mode"
            checked={settings.maintenanceMode}
            onChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
            className="mt-4"
          />
          <p className="text-sm text-gray-500 mt-1">
            Toggle to put the entire system into maintenance mode.
          </p>

          {error && <p className="text-red-500 mt-6 mb-4">{error}</p>}
          {success && <p className="text-green-500 mt-6 mb-4">{success}</p>}

          <Button type="submit" loading={saving} className="mt-8 w-full sm:w-auto">
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </form>
      </Card>
    </div>
  );
};