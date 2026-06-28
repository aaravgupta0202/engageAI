import re

with open('frontend/src/pages/AiChat.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states for Intent
content = content.replace("  const [isFetchingHistory, setIsFetchingHistory] = useState(false);",
                          "  const [isFetchingHistory, setIsFetchingHistory] = useState(false);\n  const [intent, setIntent] = useState('Advice');")

# Send Intent in request
content = content.replace("body: JSON.stringify({ message: userMsg }),",
                          "body: JSON.stringify({ message: userMsg, intent: intent }),")


intent_selector_ui = """
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Conversation Intent</div>
        <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
          {['Advice', 'Planning', 'Comparison', 'Execution'].map(mode => (
            <button 
              key={mode} 
              onClick={() => setIntent(mode)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${intent === mode ? 'bg-sbi-blue text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-slate-50 dark:bg-slate-900/50">"""

content = content.replace("      <div className=\"flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-slate-50 dark:bg-slate-900/50\">", intent_selector_ui)

with open('frontend/src/pages/AiChat.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
