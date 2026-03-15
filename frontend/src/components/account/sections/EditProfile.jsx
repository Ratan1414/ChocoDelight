import { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

export default function EditProfile({ user, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar || '',
    });
  }, [user]);

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-display font-semibold text-chocolate-800">Edit Profile</h2>
        <p className="mt-1 text-sm text-chocolate-500">Update your personal details and profile image.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-2">
          <Input label="Full Name" value={form.name} onChange={handleChange('name')} required />
          <Input label="Email" value={form.email} onChange={handleChange('email')} required type="email" />
          <Input label="Phone" value={form.phone} onChange={handleChange('phone')} type="tel" />
          <Input label="Address" value={form.address} onChange={handleChange('address')} />
          <Input
            label="Profile Image URL"
            value={form.avatar}
            onChange={handleChange('avatar')}
            placeholder="https://..."
          />

          <div className="flex items-center gap-3 lg:col-span-2">
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
