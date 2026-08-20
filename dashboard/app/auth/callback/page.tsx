'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const accessToken = searchParams.get('access_token');
    const error = searchParams.get('error');

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      document.cookie = `access_token=${accessToken}; path=/; max-age=43200`;
      router.replace('/dashboard');
      return;
    }

    router.replace(`/login?oauth_error=${encodeURIComponent(error || 'Social sign-in failed.')}`);
  }, [router]);

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Loader2 className="animate-spin" size={24} />
        <span>Completing sign-in...</span>
      </div>
    </main>
  );
}
