import AccountDashboard from '../components/account/AccountDashboard';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function AccountPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSkeleton type="text" />
      </div>
    );
  }

  return <AccountDashboard user={user} />;
}

