import React from 'react';
import Button from '../../ui/Button';

export default function ProfileView({ user, onEdit, onChangePassword }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-shrink-0 rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm w-full lg:w-1/3">
          <div className="flex flex-col items-center gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-chocolate-50">
              {user?.avatar ? (
                <img alt="Profile" src={user.avatar} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-chocolate-400">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-chocolate-800">{user.name}</h3>
              <p className="text-sm text-chocolate-500">{user.email}</p>
            </div>
            <div className="flex w-full flex-col gap-2">
              <Button variant="secondary" onClick={onEdit}>
                Edit Profile
              </Button>
              <Button variant="ghost" onClick={onChangePassword}>
                Change Password
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm flex-1">
          <h3 className="text-lg font-semibold text-chocolate-800">Account Information</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-chocolate-500 uppercase">Name</p>
              <p className="mt-1 text-sm text-chocolate-700">{user.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-chocolate-500 uppercase">Email</p>
              <p className="mt-1 text-sm text-chocolate-700">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-chocolate-500 uppercase">Phone</p>
              <p className="mt-1 text-sm text-chocolate-700">{user.phone || 'Not added yet'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-chocolate-500 uppercase">Address</p>
              <p className="mt-1 text-sm text-chocolate-700">{user.address || 'Not added yet'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-chocolate-800">Account Activity</h3>
        <p className="mt-2 text-sm text-chocolate-500">
          Your account has been active since{' '}
          <span className="font-medium text-chocolate-700">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
          . Keep your profile up to date to speed up future checkouts.
        </p>
      </div>
    </div>
  );
}
