import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, googleAuth, forgotPassword, resetPassword, getProfile, updateProfile, changePassword } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await getProfile();
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await registerUser({ name, email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const updateUserProfile = async (payload) => {
    try {
      const { data } = await updateProfile(payload);
      setUser(data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const changeUserPassword = async (payload) => {
    try {
      const { data } = await changePassword(payload);
      setUser(data.user);
      toast.success('Password updated successfully!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to change password';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const googleLogin = async (googleData) => {
    try {
      const { data } = await googleAuth(googleData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Google login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const forgotPass = async (email) => {
    try {
      const { data } = await forgotPassword({ email });
      if (data.resetUrl) {
        // Development mode: Show the reset link
        toast.success('Reset link generated! Check the server console or use the link below:');
        console.log('🔗 Reset Link:', data.resetUrl);
        // You could also show it in a modal or copy to clipboard
        setTimeout(() => {
          navigator.clipboard.writeText(data.resetUrl).then(() => {
            toast.success('Reset link copied to clipboard!');
          });
        }, 2000);
      } else {
        toast.success('Password reset email sent!');
      }
      return { success: true, resetUrl: data.resetUrl };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send reset email';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const resetPass = async (token, password) => {
    try {
      const { data } = await resetPassword(token, { password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Password reset successful!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Password reset failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      googleLogin,
      forgotPass,
      resetPass,
      loadUser,
      updateUserProfile,
      changePassword: changeUserPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
