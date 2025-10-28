import { createClient } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Use environment variables or fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xcwweoiacnptpklmxwtd.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhjd3dlb2lhY25wdHBrbG14d3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjUxMjksImV4cCI6MjA3NTYwMTEyOX0.IsGUpL6WbkExBMvouXLsCFJVYXvaWu4KjsPjPvL8-2M';

export const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={{ user, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};