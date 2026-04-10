'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth';

interface UseAdminAuthOptions {
  redirectTo?: string;
}

export function useAdminAuth(options: UseAdminAuthOptions = {}) {
  const { redirectTo = '/admin/login' } = options;
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user || user.user_metadata?.role !== 'admin') {
        router.push(redirectTo);
        return;
      }
      setUserEmail(user.email || '');
      setCheckingAuth(false);
    };

    checkAuth();
  }, [redirectTo, router]);

  const logout = useCallback(async () => {
    await signOut();
    router.push('/admin/login');
  }, [router]);

  return { userEmail, checkingAuth, logout };
}
