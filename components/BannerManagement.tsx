import React, { useState, useEffect } from 'react';
import { Banner } from '../types';
import { getBanners, addBanner, updateBanner, deleteBanner } from '../services/apiService';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Textarea } from './common/Textarea';
import { Toggle } from './common/Toggle';
import { Card } from './common/Card';
import { fileToBase64 } from '../utils/base64';

// Rename component from 'Banner' to 'BannerPage' to avoid name collision with 'Banner' interface
export const BannerPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Partial<Banner> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const fetchedBanners = await getBanners();
      setBanners(fetchedBanners);
    } catch (err) {
      setError('Failed to fetch banners.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = () => {
    setCurrentBanner({});
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setCurrentBanner(banner);
    setImagePreview(banner.imageUrl);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteBanner = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner(id);
        fetchBanners();
      } catch (err) {
        setError('Failed to delete banner.');
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentBanner(null);
    setImageFile(null);
    setImagePreview(null);
    setSaving(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
    } else {
      setImageFile(null);
      setImagePreview(currentBanner?.imageUrl || null);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBanner?.title || !currentBanner?.description) {
      alert('Title and Description are required.');
      return;
    }

    setSaving(true);
    try {
      let imageUrlToSave = currentBanner.imageUrl;
      if (imageFile) {
        imageUrlToSave = imagePreview || ''; // Use the base64 preview as the new URL
      } else if (!imageUrlToSave && !currentBanner.id) {
         // If adding a new banner and no image selected, assign a placeholder
        imageUrlToSave = 'https://picsum.photos/800/200?random=placeholder';
      }

      const bannerToSave = {
        ...currentBanner,
        imageUrl: imageUrlToSave,
        isActive: currentBanner.isActive ?? true, // Default to active if not set
      } as Banner;

      if (bannerToSave.id) {
        await updateBanner(bannerToSave);
      } else {
        await addBanner(bannerToSave);
      }
      fetchBanners();
      handleModalClose();
    } catch (err) {
      setError('Failed to save banner.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-darkText">
        Loading Banners...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-darkText">Banner</h2>

      <div className="flex justify-end mb-6">
        <Button onClick={handleAddBanner} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}>
          Add New Banner
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-darkBorder">
            <thead className="bg-darkBg">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Active
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder">
              {banners.map((banner) => (
                <tr key={banner.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={banner.imageUrl} alt={banner.title} className="w-24 h-12 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{banner.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText max-w-xs overflow-hidden text-ellipsis">{banner.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.isActive ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="secondary" size="sm" onClick={() => handleEditBanner(banner)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteBanner(banner.id)}>
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
        title={currentBanner?.id ? 'Edit Banner' : 'Add New Banner'}
        footer={
          <Button type="submit" loading={saving} form="banner-form">
            {saving ? 'Saving...' : 'Save Banner'}
          </Button>
        }
      >
        <form id="banner-form" onSubmit={handleSaveBanner}>
          <Input
            id="title"
            label="Banner Title"
            value={currentBanner?.title || ''}
            onChange={(e) => setCurrentBanner({ ...currentBanner, title: e.target.value })}
            required
          />
          <Textarea
            id="description"
            label="Banner Description"
            value={currentBanner?.description || ''}
            onChange={(e) => setCurrentBanner({ ...currentBanner, description: e.target.value })}
            rows={3}
            required
          />
          <div className="mb-4">
            <label htmlFor="imageUpload" className="block text-sm font-medium leading-6 text-darkText">
              Banner Image
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-darkText
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary/20 file:text-primary
              hover:file:bg-primary/30"
            />
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                <img src={imagePreview} alt="Banner Preview" className="max-w-xs h-auto rounded" />
              </div>
            )}
          </div>
          <Toggle
            id="isActive"
            label="Active"
            checked={currentBanner?.isActive ?? true}
            onChange={(checked) => setCurrentBanner({ ...currentBanner, isActive: checked })}
            className="mt-4"
          />
        </form>
      </Modal>
    </div>
  );
};