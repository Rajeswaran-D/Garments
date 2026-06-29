import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Fix 10: Skeleton card for combo loading state
function SkeletonComboCard() {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden animate-pulse">
      <div className="aspect-video bg-[var(--color-bg-soft)]" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-[var(--color-bg-soft)] rounded w-2/3" />
        <div className="h-3 bg-[var(--color-bg-soft)] rounded w-full" />
        <div className="h-3 bg-[var(--color-bg-soft)] rounded w-4/5" />
        <div className="h-10 bg-[var(--color-bg-soft)] rounded-lg mt-4" />
      </div>
    </div>
  );
}

export default function Combos() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fix 11: Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const from = (page - 1) * LIMIT;
        const to = from + LIMIT - 1;

        const { data, error, count } = await supabase
          .from('combos')
          .select('*, combo_products(product_id, products(*))', { count: 'exact' })
          .range(from, to)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setCombos(data || []);
        setTotalPages(count ? Math.ceil(count / LIMIT) : 1);
      } catch (err) {
        console.error(err);
        setError('Unable to load combos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const getComboPrice = (combo: any) => {
    const products: any[] = combo.combo_products?.map((cp: any) => cp.products) || [];
    const original = products.reduce((sum: number, p: any) => sum + (p?.price || 0), 0);
    const final = original - (original * combo.discount_percentage) / 100;
    return { original, final };
  };

  return (
    <div className="bg-[var(--color-bg-soft)] min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-white py-16 border-b border-[var(--color-border-light)] w-full block">
        <div className="container-site text-center">
          <p className="label-overline mb-3 text-[var(--color-primary-green)] block">Exclusive Deals</p>
          <h1 className="heading-section mb-4 block w-full text-center">Combo Offers</h1>
          <p className="text-[var(--color-text-secondary)] text-base max-w-xl mx-auto block text-center">
            Bundle your favourite pieces and save with our curated premium combo deals.
          </p>
        </div>
      </div>

      <div className="container-site section-gap">
        <div className="container-content">
          {loading ? (
            // Fix 10: Skeleton grid instead of spinner
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonComboCard key={i} />)}
            </div>
          ) : error ? (
            <div className="state-error mx-auto">
              <p className="font-semibold">{error}</p>
            </div>
          ) : combos.length === 0 ? (
            <div className="state-empty">
              <svg className="w-16 h-16 text-[var(--color-border-dark)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <p className="text-lg font-medium text-[var(--color-text-primary)]">No combo offers available</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {combos.map((c: any) => {
                const { original, final } = getComboPrice(c);
                const products: any[] = c.combo_products?.map((cp: any) => cp.products) || [];
                const hasPrice = original > 0;

                return (
                  <div key={c.id} className="product-card group bg-white">
                    {/* Banner */}
                    <div className="relative overflow-hidden bg-[var(--color-bg-soft)] aspect-video rounded-t-2xl">
                      {c.banner_image ? (
                        <img
                          src={c.banner_image}
                          alt={c.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                          <span className="text-xs tracking-widest uppercase">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full shadow-md">
                        {c.discount_percentage}% OFF
                      </div>
                    </div>

                    <div className="product-card-body p-6">
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{c.name}</h3>
                      <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2 mb-4 leading-relaxed">{c.description}</p>

                      {/* Included Products Mini List */}
                      {products.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Includes:</p>
                          <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                            {products.slice(0, 3).map((p: any) => (
                              <li key={p?.id} className="truncate">• {p?.name}</li>
                            ))}
                            {products.length > 3 && (
                              <li className="text-[var(--color-text-muted)] italic">+{products.length - 3} more items</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Pricing */}
                      <div className="mt-auto pt-4 border-t border-[var(--color-border-light)]">
                        {hasPrice ? (
                          <div className="flex items-end gap-3">
                            <span className="text-2xl font-bold text-[var(--color-primary-green)]">₹{final.toFixed(0)}</span>
                            <span className="text-sm font-medium text-[var(--color-text-muted)] line-through mb-1">₹{original.toFixed(0)}</span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-[var(--color-primary-green)]">{c.discount_percentage}% Discount</span>
                        )}
                      </div>
                    </div>

                    <div className="product-card-footer px-6 pb-6 pt-0">
                      <Link to={`/combos/${c.id}`} className="btn-secondary w-full text-center block py-3">
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Fix 11: Pagination controls */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 text-sm font-semibold border border-[var(--color-border-light)] rounded-full hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2 text-sm font-semibold border border-[var(--color-border-light)] rounded-full hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}