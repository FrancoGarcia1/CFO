'use client';

import { useAuth } from '@/providers/auth-provider';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CurrencySelector } from '@/components/layout/currency-selector';

export function Header() {
  const { profile, user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (profile?.nombre) {
      setDisplayName(profile.nombre);
      setEmail(profile.email || '');
      setEmpresa(profile.empresa || '');
      return;
    }
    if (user) {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        const meta = data.session?.user?.user_metadata;
        setDisplayName(meta?.nombre || data.session?.user?.email?.split('@')[0] || 'Usuario');
        setEmail(data.session?.user?.email || '');
        setEmpresa(meta?.empresa || '');
      });
    }
  }, [profile, user]);

  // Close menu on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  async function handleSignOut() {
    setMenuOpen(false);
    await signOut();
    router.push('/auth/login');
  }

  const initial = displayName ? displayName.charAt(0).toUpperCase() : '·';
  const plan = profile?.plan || 'trial';
  const planLabel = plan === 'active' ? 'Plan Activo' : plan === 'trial' ? 'Prueba Gratuita' : 'Cancelado';

  return (
    <>
      <header className="sticky top-0 z-50" style={{ background: '#1a1a1a' }}>
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3">
          <span className="text-sm tracking-tight" style={{ color: '#f5f0eb' }}>
            <span className="font-bold">Capital CFO</span>
          </span>

          <div className="flex items-center gap-2 sm:gap-3">
            <CurrencySelector />
            <span className="text-xs hidden sm:inline" style={{ color: '#7a756e' }}>
              {displayName || '···'}
            </span>

            {/* Avatar button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
                style={{
                  background: menuOpen ? '#d4a574' : '#2a2a2a',
                  color: menuOpen ? '#0f0f0f' : '#f5f0eb',
                  border: '1px solid #3a3a3a',
                }}
                title="Mi cuenta"
              >
                {initial}
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 rounded-lg overflow-hidden shadow-2xl z-50"
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    animation: 'menuIn 0.15s ease forwards',
                  }}
                >
                  {/* User info */}
                  <div className="p-4" style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: '#d4a574', color: '#0f0f0f' }}
                      >
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: '#f5f0eb' }}>
                          {displayName}
                        </div>
                        <div className="text-[11px] truncate" style={{ color: '#7a756e' }}>
                          {email}
                        </div>
                      </div>
                    </div>
                    {empresa && (
                      <div className="mt-3 text-[11px] font-mono px-3 py-1.5 rounded inline-block" style={{ background: '#242424', color: '#7a756e', border: '1px solid #2a2a2a' }}>
                        {empresa}
                      </div>
                    )}
                    <div className="mt-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                        style={{
                          background: plan === 'active' ? 'rgba(212,165,116,0.15)' : 'rgba(122,117,110,0.15)',
                          color: plan === 'active' ? '#d4a574' : '#7a756e',
                        }}
                      >
                        {planLabel}
                      </span>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => { setMenuOpen(false); setSupportOpen(true); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors duration-150"
                      style={{ color: '#f5f0eb' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#242424'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a756e" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Soporte y ayuda
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors duration-150"
                      style={{ color: '#ff4757' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#242424'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="1.5">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-px" style={{ background: '#2a2a2a' }} />
      </header>

      {/* Support Modal */}
      {supportOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          onClick={() => setSupportOpen(false)}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }} />
          <div
            className="relative w-full max-w-md rounded-lg p-6"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', animation: 'menuIn 0.2s ease' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: '#f5f0eb' }}>Soporte y ayuda</h3>
              <button
                onClick={() => setSupportOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: '#242424', color: '#7a756e' }}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: '#242424', border: '1px solid #2a2a2a' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#d4a574' }}>
                  Correo de soporte
                </div>
                <a href="mailto:contacto@vcfo.ai" className="text-sm font-mono transition-colors" style={{ color: '#f5f0eb' }}>
                  contacto@vcfo.ai
                </a>
              </div>

              <div className="p-4 rounded-lg" style={{ background: '#242424', border: '1px solid #2a2a2a' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#d4a574' }}>
                  WhatsApp
                </div>
                <a href="https://wa.me/51999999999" className="text-sm font-mono transition-colors" style={{ color: '#f5f0eb' }}>
                  +51 999 999 999
                </a>
              </div>

              <div className="p-4 rounded-lg" style={{ background: '#242424', border: '1px solid #2a2a2a' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#d4a574' }}>
                  Horario de atención
                </div>
                <p className="text-sm" style={{ color: '#7a756e' }}>
                  Lunes a Viernes, 9:00 AM — 6:00 PM (hora Perú)
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs text-center" style={{ color: '#3a3a3a' }}>
              Capital CFO
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
