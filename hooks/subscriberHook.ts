import { subscriberRequest } from '@/lib/subscriberApi';
import { useState } from 'react';
import { toast } from 'react-hot-toast';


export function useSubscriber() {
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // New state

  const subscribe = async (email: string) => {
    // Basic validation before even hitting the API
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return false;
    }

    setLoading(true);
    try {
      // Use the absolute path if your lib handles the base URL, 
      // or just the endpoint if your lib adds the base URL automatically.
      await subscriberRequest('/api/v1/users/subscriber', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      toast.success("Welcome aboard! Check your inbox.");
      setIsSubscribed(true); // Mark as successful
      return true;
    } catch (err: any) {
      // Handles 'Email already exists' or server errors
      toast.error(err.message || "Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading, isSubscribed };
}