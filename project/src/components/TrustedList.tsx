import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TrustedContact {
  id: string;
  name: string;
  type: 'email' | 'phone';
  value: string;
  createdAt: Date;
}

export const TrustedList: React.FC = () => {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'email' as 'email' | 'phone',
    value: ''
  });

  // Fetch trusted contacts
  useEffect(() => {
    const contactsRef = collection(db, 'trustedContacts');
    const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as TrustedContact[];
      
      setContacts(contactsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing contact
        await updateDoc(doc(db, 'trustedContacts', editingId), {
          ...formData,
          updatedAt: new Date()
        });
      } else {
        // Add new contact
        await addDoc(collection(db, 'trustedContacts'), {
          ...formData,
          createdAt: new Date()
        });
      }
      // Reset form
      setFormData({ name: '', type: 'email', value: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteDoc(doc(db, 'trustedContacts', id));
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleEdit = (contact: TrustedContact) => {
    setFormData({
      name: contact.name,
      type: contact.type,
      value: contact.value
    });
    setEditingId(contact.id);
    setIsAdding(true);
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="glass-effect p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Trusted Contacts</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white/5 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'email' | 'phone' })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Value</label>
              <input
                type={formData.type === 'email' ? 'email' : 'tel'}
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ name: '', type: 'email', value: '' });
              }}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {editingId ? 'Update' : 'Add'} Contact
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">{contact.name}</h3>
                <p className="text-sm text-gray-400">
                  {contact.type === 'email' ? contact.value : `+${contact.value}`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(contact)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 