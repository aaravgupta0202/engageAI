import re

with open('frontend/src/pages/CustomerDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

timeline_func = """
  // Generate deterministic past events based on age and demographics
  const generatePastEvents = (profile: any) => {
    const age = parseInt(profile?.age) || 30;
    const currentYear = new Date().getFullYear();
    const events = [];
    
    if (age > 22) {
      events.push({ year: currentYear - (age - 22), title: "First Job", desc: "Started full-time employment.", color: "bg-slate-400" });
    }
    if (age > 26) {
      events.push({ year: currentYear - (age - 26), title: "Bought Car", desc: "First major vehicle purchase.", color: "bg-slate-500" });
    }
    if (profile?.demographics?.toLowerCase().includes('married') || age > 28) {
      events.push({ year: currentYear - (age - 28), title: "Married", desc: "Tied the knot.", color: "bg-pink-400" });
    }
    if (profile?.demographics?.toLowerCase().includes('child') || profile?.demographics?.toLowerCase().includes('dependents') || age > 31) {
      events.push({ year: currentYear - (age - 31), title: "Child Born", desc: "Expanded the family.", color: "bg-purple-400" });
    }
    if (profile?.income && parseNum(profile.income) > 1000000) {
      events.push({ year: currentYear - 1, title: "Salary Hike", desc: "Significant income increase.", color: "bg-green-400" });
    }
    
    return events.sort((a: any, b: any) => b.year - a.year);
  };
"""

content = content.replace("  const metrics = data?.profile ? calculateMetrics(data.profile) : null;", 
"  const metrics = data?.profile ? calculateMetrics(data.profile) : null;\n" + timeline_func)

new_timeline = """<Card className="md:col-span-3 glass-card border-t-4 border-t-purple-500 overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-white flex items-center"><CalendarClock className="w-6 h-6 mr-2 text-purple-500" /> Financial Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 pl-6 space-y-6">
              
              {hasRunAnalysis || (data.recommendations && data.recommendations.length > 0) ? (
                <div className="relative">
                  <div className="absolute -left-[33px] bg-sbi-blue rounded-full w-4 h-4 border-4 border-white dark:border-slate-900 animate-pulse"></div>
                  <p className="text-sm text-sbi-blue font-bold tracking-wider uppercase mb-1">Next Step</p>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">AI Recommendations Ready</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <button className="p-0 h-auto text-sbi-blue font-semibold hover:text-sbi-navy hover:underline text-base outline-none bg-transparent" onClick={() => onNavigate('recommendations')}>
                      Review proactive actions ➔
                    </button>
                  </p>
                </div>
              ) : (
                <div className="relative opacity-60">
                  <div className="absolute -left-[33px] bg-slate-300 rounded-full w-4 h-4 border-4 border-white dark:border-slate-900"></div>
                  <p className="text-sm text-slate-500 mb-1">Upcoming</p>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">AI Recommendations Pending</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Run the Engagement Cycle to predict future needs.</p>
                </div>
              )}

              <div className="relative">
                <div className="absolute -left-[33px] bg-green-500 rounded-full w-4 h-4 border-4 border-white dark:border-slate-900"></div>
                <p className="text-sm text-slate-500 mb-1">Today</p>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Current State Active</h4>
              </div>

              {Object.entries(data.life_events || {}).filter(([_, val]) => val).map(([key, _]) => (
                <div key={key} className="relative">
                  <div className="absolute -left-[33px] bg-emerald-500 rounded-full w-4 h-4 border-4 border-white dark:border-slate-900"></div>
                  <p className="text-sm text-slate-500 mb-1">Recent Event</p>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Detected: {key.replace(/_/g, ' ').toUpperCase()} <span className="text-xs ml-2 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Confidence: 91%</span></h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">AI identified this life event from transaction patterns.</p>
                </div>
              ))}

              {generatePastEvents(data.profile).map((ev: any, idx: number) => (
                <div key={idx} className="relative opacity-80 hover:opacity-100 transition-opacity">
                  <div className={`absolute -left-[33px] ${ev.color} rounded-full w-4 h-4 border-4 border-white dark:border-slate-900`}></div>
                  <p className="text-sm text-slate-500 mb-1">{ev.year}</p>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{ev.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{ev.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>"""

pattern = re.compile(r'<Card className="md:col-span-3 glass-card border-t-4 border-t-purple-500 overflow-hidden relative">.*?</Card>', re.DOTALL)
content = pattern.sub(new_timeline, content)

with open('frontend/src/pages/CustomerDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Timeline updated")
