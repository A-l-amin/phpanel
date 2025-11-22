import React, { useState, useEffect, useCallback } from 'react';
import { FAQ } from '../types';
import { getFAQs, addFAQ, updateFAQ, deleteFAQ, updateFAQOrder } from '../services/apiService';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Textarea } from './common/Textarea';
import { Card } from './common/Card';

// Drag & Drop utilities (simplified for basic reordering within a list)
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Rename component from 'FAQ' to 'FAQPage' to avoid name collision with 'FAQ' interface
export const FAQPage: React.FC = () => {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState<Partial<FAQ> | null>(null);
  const [saving, setSaving] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedFAQs = await getFAQs();
      setFAQs(fetchedFAQs);
    } catch (err) {
      setError('Failed to fetch FAQs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddFAQ = () => {
    setCurrentFAQ({});
    setIsModalOpen(true);
  };

  const handleEditFAQ = (faq: FAQ) => {
    setCurrentFAQ(faq);
    setIsModalOpen(true);
  };

  const handleDeleteFAQ = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await deleteFAQ(id);
        fetchFAQs(); // Refetch to ensure order is updated
      } catch (err) {
        setError('Failed to delete FAQ.');
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentFAQ(null);
    setSaving(false);
  };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFAQ?.question || !currentFAQ?.answer) {
      alert('Question and Answer are required.');
      return;
    }
    setSaving(true);
    try {
      if (currentFAQ.id) {
        await updateFAQ(currentFAQ as FAQ);
      } else {
        await addFAQ(currentFAQ as Omit<FAQ, 'id' | 'order'>);
      }
      fetchFAQs();
      handleModalClose();
    } catch (err) {
      setError('Failed to save FAQ.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newFAQs = reorder(faqs, draggedItemIndex, index);
    setFAQs(newFAQs);
    setDraggedItemIndex(index); // Update dragged item's current position
  };

  const handleDragEnd = async () => {
    setDraggedItemIndex(null);
    // Persist the new order to the backend
    try {
      await updateFAQOrder(faqs);
      // Re-fetch to confirm backend order matches
      fetchFAQs();
    } catch (err) {
      setError('Failed to update FAQ order.');
      console.error(err);
      // Optionally, revert local state if backend update fails
      fetchFAQs();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-darkText">
        Loading FAQs...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-darkText">FAQ</h2>

      <div className="flex justify-end mb-6">
        <Button onClick={handleAddFAQ} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}>
          Add New FAQ
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-darkBorder">
            <thead className="bg-darkBg">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Question
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Answer
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder">
              {faqs.map((faq, index) => (
                <tr
                  key={faq.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`${draggedItemIndex === index ? 'bg-primary/10' : ''} hover:bg-darkBg transition-colors duration-200 cursor-grab`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{faq.order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText max-w-sm overflow-hidden text-ellipsis">{faq.question}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText max-w-md overflow-hidden text-ellipsis">{faq.answer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="secondary" size="sm" onClick={() => handleEditFAQ(faq)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteFAQ(faq.id)}>
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
        title={currentFAQ?.id ? 'Edit FAQ' : 'Add New FAQ'}
        footer={
          <Button type="submit" loading={saving} form="faq-form">
            {saving ? 'Saving...' : 'Save FAQ'}
          </Button>
        }
      >
        <form id="faq-form" onSubmit={handleSaveFAQ}>
          <Input
            id="question"
            label="Question"
            value={currentFAQ?.question || ''}
            onChange={(e) => setCurrentFAQ({ ...currentFAQ, question: e.target.value })}
            required
          />
          <Textarea
            id="answer"
            label="Answer"
            value={currentFAQ?.answer || ''}
            onChange={(e) => setCurrentFAQ({ ...currentFAQ, answer: e.target.value })}
            rows={5}
            required
          />
        </form>
      </Modal>
    </div>
  );
};