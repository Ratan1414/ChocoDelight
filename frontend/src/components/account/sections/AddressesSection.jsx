import { useState } from 'react';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';

export default function AddressesSection({ addresses, onSave, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState({ label: '', line1: '', line2: '', city: '', state: '', zip: '', phone: '' });

  const openNew = () => {
    setEditingAddress(null);
    setForm({ label: '', line1: '', line2: '', city: '', state: '', zip: '', phone: '' });
    setModalOpen(true);
  };

  const openEdit = (address) => {
    setEditingAddress(address);
    setForm({
      label: address.label || '',
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || '',
      phone: address.phone || '',
    });
    setModalOpen(true);
  };

  const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = () => {
    const payload = { ...form, id: editingAddress?.id || Date.now().toString() };
    onSave(payload);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-chocolate-800">Saved Addresses</h2>
          <p className="mt-1 text-sm text-chocolate-500">Keep your delivery information handy for faster checkout.</p>
        </div>
        <Button onClick={openNew}>Add New Address</Button>
      </div>

      {!addresses.length ? (
        <div className="rounded-3xl border border-chocolate-100 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-chocolate-800">No saved addresses</p>
          <p className="mt-2 text-sm text-chocolate-500">Add an address to simplify shipping during checkout.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-chocolate-800">{address.label}</p>
                  <p className="mt-1 text-sm text-chocolate-500">
                    {address.line1}
                    <br />
                    {address.line2 && <>{address.line2}<br /></>}
                    {address.city}, {address.state} {address.zip}
                    <br />
                    {address.phone}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(address)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(address.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        title={editingAddress ? 'Edit Address' : 'Add Address'}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Address</Button>
          </div>
        }
      >
        <div className="grid gap-4">
          <Input label="Label" value={form.label} onChange={handleChange('label')} placeholder="Home / Work" />
          <Input label="Address line 1" value={form.line1} onChange={handleChange('line1')} />
          <Input label="Address line 2" value={form.line2} onChange={handleChange('line2')} />
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="City" value={form.city} onChange={handleChange('city')} />
            <Input label="State" value={form.state} onChange={handleChange('state')} />
            <Input label="ZIP" value={form.zip} onChange={handleChange('zip')} />
          </div>
          <Input label="Phone" value={form.phone} onChange={handleChange('phone')} type="tel" />
        </div>
      </Modal>
    </div>
  );
}
