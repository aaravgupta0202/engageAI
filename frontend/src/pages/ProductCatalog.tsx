import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Shield, TrendingUp, PiggyBank, CreditCard, Landmark, Smartphone, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility_rules: any;
  link?: string;
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const adminMode = false;
  const [editForm, setEditForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'invest': return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'protect': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'save': return <PiggyBank className="w-5 h-5 text-purple-500" />;
      case 'borrow': return <Landmark className="w-5 h-5 text-amber-500" />;
      case 'cards': return <CreditCard className="w-5 h-5 text-indigo-500" />;
      case 'digital': return <Smartphone className="w-5 h-5 text-cyan-500" />;
      default: return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      invest: 'Invest & Grow',
      protect: 'Insurance & Protection',
      save: 'Accounts & Deposits',
      borrow: 'Loans & Borrowing',
      cards: 'Credit Cards',
      digital: 'Digital Banking'
    };
    return map[cat] || cat;
  };

  const filteredProducts = products.filter(p => {
    if (filter !== 'all' && p.category !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 glass-panel p-8 rounded-3xl">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Product Catalog</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Browse and discover all available SBI financial products, offers, and plans.</p>
        </div>
        <div className="relative w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-sbi-blue transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
          className={`rounded-full px-6 flex-shrink-0 ${filter === 'all' ? 'bg-sbi-navy text-white hover:bg-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'}`}
        >
          All Products
        </Button>
        {['save', 'borrow', 'invest', 'protect', 'cards', 'digital'].map(cat => (
          <Button 
            key={cat}
            variant={filter === cat ? 'default' : 'outline'} 
            onClick={() => setFilter(cat)}
            className={`rounded-full px-6 flex-shrink-0 ${filter === cat ? 'bg-sbi-blue text-white' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'}`}
          >
            {getCategoryLabel(cat)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-sbi-blue rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="glass-card hover:shadow-xl transition-all duration-300 group overflow-hidden border-t-4 border-transparent hover:border-t-sbi-blue flex flex-col">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm inline-block">
                    {getCategoryIcon(product.category)}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <CardTitle className="text-xl text-slate-800 dark:text-white group-hover:text-sbi-blue transition-colors">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex-grow flex flex-col">
                <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{product.description}</p>
                
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center mt-auto">
                  <div className="text-xs text-slate-400 font-medium">
                    {Object.keys(product.eligibility_rules).length > 0 ? 
                      <span className="text-indigo-500 font-semibold flex items-center"><Search className="w-3 h-3 mr-1"/> Rules Apply</span> : 
                      <span className="text-emerald-500 font-semibold flex items-center"><Shield className="w-3 h-3 mr-1"/> Pre-approved</span>
                    }
                  </div>
                  <button 
                    onClick={() => {
                      if (adminMode) {
                        setSelectedProduct(product);
                        setEditForm(JSON.parse(JSON.stringify(product)));
                      } else {
                        const url = product.link || (product as any).url;
                        if (url) window.open(url, '_blank');
                        else alert('No website link available for this product.');
                      }
                    }} 
                    className="bg-transparent text-sbi-blue hover:text-sbi-navy hover:underline font-semibold p-0 px-3 outline-none"
                  >
                    {adminMode ? 'Edit Product →' : 'Go to Website →'}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center glass-panel rounded-3xl">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div>
                {!adminMode ? (
                  <>
                    <span className="text-xs font-semibold uppercase tracking-wider text-sbi-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full mb-2 inline-block">
                      {selectedProduct.category}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{selectedProduct.name}</h3>
                  </>
                ) : (
                  <div className="space-y-2">
                    <input 
                      className="w-full px-3 py-1 border border-slate-200 rounded text-xs font-semibold uppercase tracking-wider text-sbi-blue bg-blue-50 focus:outline-none focus:ring-1 focus:ring-sbi-blue"
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    />
                    <input 
                      className="w-full px-3 py-2 border border-slate-200 rounded text-2xl font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sbi-blue"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                )}
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-white dark:bg-slate-800 rounded-full shadow-sm flex-shrink-0">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                {!adminMode ? (
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedProduct.description}</p>
                ) : (
                  <textarea 
                    className="w-full px-3 py-2 border border-slate-200 rounded text-slate-700 leading-relaxed min-h-[100px] focus:outline-none focus:ring-1 focus:ring-sbi-blue"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  />
                )}
              </div>
              
              {(!adminMode && Object.keys(selectedProduct.eligibility_rules).length > 0) && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-1"/> Eligibility & Rules
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                    <ul className="space-y-2">
                      {Object.entries(selectedProduct.eligibility_rules).map(([key, val]) => (
                        <li key={key} className="flex flex-col sm:flex-row sm:justify-between text-sm">
                          <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{String(val)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {adminMode && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-1"/> Eligibility & Rules (JSON)
                  </h4>
                  <textarea 
                    className="w-full px-3 py-2 border border-slate-200 rounded text-slate-700 font-mono text-xs min-h-[120px] focus:outline-none focus:ring-1 focus:ring-sbi-blue"
                    value={typeof editForm.eligibility_rules === 'string' ? editForm.eligibility_rules : JSON.stringify(editForm.eligibility_rules, null, 2)}
                    onChange={(e) => setEditForm({...editForm, eligibility_rules: e.target.value})}
                  />
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={() => setSelectedProduct(null)} variant="outline" className="rounded-full px-8">Close</Button>
              {(!adminMode && selectedProduct.link) && (
                <Button 
                  onClick={() => window.open(selectedProduct.link, '_blank')} 
                  className="rounded-full bg-sbi-blue hover:bg-sbi-navy text-white px-8"
                >
                  Apply Now
                </Button>
              )}
              {adminMode && (
                <Button 
                  onClick={async () => {
                    setSaving(true);
                    try {
                      // parse rules back to JSON
                      let rulesToSave = editForm.eligibility_rules;
                      if (typeof rulesToSave === 'string') {
                        try { rulesToSave = JSON.parse(rulesToSave); } catch (e) { /* ignore parse error on save for simple MVP */ }
                      }
                      const payload = { ...editForm, eligibility_rules: rulesToSave };
                      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                      
                      const res = await fetch(`${API_URL}/products/${selectedProduct.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      
                      if (res.ok) {
                        const updated = await res.json();
                        setProducts(products.map(p => p.id === updated.product.id ? updated.product : p));
                        setSelectedProduct(updated.product);
                        setEditForm(updated.product);
                      }
                    } catch (e) {
                      console.error("Save error", e);
                    } finally {
                      setSaving(false);
                    }
                  }} 
                  className="rounded-full bg-sbi-blue hover:bg-sbi-navy text-white px-8"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
