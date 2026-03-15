import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../services/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      const { data } = await api.getWishlist();
      setWishlist(data.wishlist);
    } catch (error) {
      console.error('Failed to load wishlist');
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }

    const isInWishlist = wishlist.some(item => item._id === productId);
    try {
      if (isInWishlist) {
        const { data } = await api.removeFromWishlist(productId);
        setWishlist(data.wishlist);
        toast.success('Removed from wishlist');
      } else {
        const { data } = await api.addToWishlist(productId);
        setWishlist(data.wishlist);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
