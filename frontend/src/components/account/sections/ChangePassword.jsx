import { useState } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

export default function ChangePassword({ onChangePassword, loading }) {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return;
    }
    onChangePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
  };

  return (
    <div className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-display font-semibold text-chocolate-800">Change Password</h2>
      <p className="mt-1 text-sm text-chocolate-500">Update your password to keep your account secure.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
        <Input
          label="Current Password"
          type="password"
          value={form.oldPassword}
          onChange={handleChange('oldPassword')}
          required
        />
        <Input
          label="New Password"
          type="password"
          value={form.newPassword}
          onChange={handleChange('newPassword')}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          required
        />
        <div className="md:col-span-2 flex justify-end gap-3">
          <Button type="submit" loading={loading}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
