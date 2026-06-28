import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Network, Search } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  category: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  data?: any;
}

interface Edge {
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export default function FinancialGraphView({ data }: { data: any }) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Generate nodes based on data
  const nodes: Node[] = [
    { id: 'customer', label: data?.archetype || 'Customer', category: 'hub', x: 50, y: 50, data: { id: data?.customer_id } },
    { id: 'demographics', label: 'Demographics', category: 'static', x: 20, y: 30, data: { age: data?.profile?.age, occupation: data?.profile?.occupation } },
    { id: 'income', label: 'Income', category: 'flow', x: 80, y: 30, data: { monthly: data?.profile?.income } },
    { id: 'goals', label: 'Life Goals', category: 'static', x: 20, y: 70, data: { goals: data?.profile?.goals } },
  ];

  const edges: Edge[] = [
    { source: 'demographics', target: 'customer' },
    { source: 'income', target: 'customer' },
    { source: 'goals', target: 'customer' },
  ];

  // Add life event nodes dynamically
  let eventOffset = 0;
  if (data?.life_events) {
    Object.entries(data.life_events).forEach(([key, val]) => {
      if (val) {
        const eventId = `event_${key}`;
        nodes.push({
          id: eventId,
          label: key.replace(/_/g, ' ').toUpperCase(),
          category: 'event',
          x: 80,
          y: 70 + eventOffset,
          data: { confidence: '91%', source: 'Transaction pattern inference' }
        });
        edges.push({ source: eventId, target: 'customer', animated: true });
        eventOffset += 15;
      }
    });
  }

  const getNodeColor = (category: string) => {
    switch (category) {
      case 'hub': return 'bg-sbi-blue text-white ring-4 ring-blue-100 dark:ring-blue-900';
      case 'event': return 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-900 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]';
      case 'flow': return 'bg-purple-500 text-white';
      default: return 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <Card className="md:col-span-3 glass-card border-t-4 border-t-sbi-blue overflow-hidden">
      <CardHeader>
        <CardTitle className="text-slate-800 dark:text-white flex items-center">
          <Network className="w-6 h-6 mr-2 text-sbi-blue" /> Financial Life Graph View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 h-[400px]">
          {/* Canvas Area */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner group">
            
            {/* SVG Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="event-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {edges.map((edge, i) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;
                
                return (
                  <line 
                    key={i}
                    x1={`${sourceNode.x}%`} 
                    y1={`${sourceNode.y}%`} 
                    x2={`${targetNode.x}%`} 
                    y2={`${targetNode.y}%`} 
                    stroke={edge.animated ? "url(#event-gradient)" : "url(#edge-gradient)"}
                    strokeWidth={edge.animated ? 3 : 2}
                    className={edge.animated ? "animate-pulse" : ""}
                  />
                );
              })}
            </svg>

            {/* HTML Nodes */}
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer z-10 flex flex-col items-center ${getNodeColor(node.category)} ${selectedNode?.id === node.id ? 'ring-offset-2 ring-2 ring-slate-400 scale-105' : ''}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                {node.label}
              </button>
            ))}
          </div>

          {/* Side Panel */}
          <div className="w-full md:w-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sbi-blue opacity-5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center text-slate-800 dark:text-white font-bold mb-4 border-b border-slate-100 dark:border-slate-700 pb-3 relative z-10">
              <Search className="w-5 h-5 mr-2 text-sbi-blue" /> Inspect Node
            </div>
            
            {selectedNode ? (
              <div className="flex-1 overflow-y-auto relative z-10 pr-2">
                <div className="mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Node Category</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    selectedNode.category === 'event' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' :
                    selectedNode.category === 'hub' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {selectedNode.category.toUpperCase()}
                  </span>
                </div>
                <div className="mb-5">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Entity Label</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{selectedNode.label}</h3>
                </div>
                <div className="space-y-3 mt-4">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block border-b border-slate-100 dark:border-slate-700 pb-1">Data Model Payload</span>
                  {selectedNode.data && Object.keys(selectedNode.data).length > 0 ? Object.entries(selectedNode.data).map(([k, v]) => (
                    <div key={k} className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">{k}</div>
                      <div className="text-sm font-mono text-slate-800 dark:text-slate-200 break-words font-medium">
                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-slate-400 italic">No additional metadata attached to this node.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 relative z-10">
                <Network className="w-12 h-12 mb-3 text-slate-400" strokeWidth={1} />
                <p className="text-sm font-medium">Click any node on the graph canvas to inspect its underlying data and confidence score.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
