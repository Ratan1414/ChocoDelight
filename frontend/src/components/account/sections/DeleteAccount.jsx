import React from 'react';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

export default function DeleteAccount({ onDelete }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-display font-semibold text-chocolate-800">Delete Account</h2>
      <p className="mt-2 text-sm text-chocolate-500">
        Deleting your account will permanently remove your profile, order history, and wishlist. This action cannot be undone.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete My Account
        </Button>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Learn more
        </Button>
      </div>

      <Modal
        isOpen={open}
        title="Confirm account deletion"
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => {
              onDelete();
              setOpen(false);
            }}>
              Delete account
            </Button>
          </div>
        }
      >
        <p className="text-sm text-chocolate-600">
          Are you sure you want to delete your account? This action is permanent and cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
