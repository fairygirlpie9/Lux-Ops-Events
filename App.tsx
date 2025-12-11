import React, { useState, useEffect } from 'react';
import { Layout, Layers, ShieldCheck, Wand2, Users, Clock, Search, MapPin, Hexagon } from 'lucide-react';
import Timeline from './components/Timeline';
import FloorPlan from './components/FloorPlan';
import CommunicationLog from './components/CommunicationLog';
import ClientManager from './components/ClientManager';
import Notifications from './components/Notifications';
import { generateEventScenario } from './services/geminiService';
import { Task, FloorItem, ChatMessage, TaskStatus, FurnitureType, Client, Notification, NotificationType } from './types';

// Default Demo Data with Future Dates
const INITIAL_TASKS: Task[] = [
  { id: '1', time: '14:00', title: 'Vendor Load-in & Valet Prep', role: 'Ops Manager', status: TaskStatus.COMPLETED },
  { id: '2', time: '15:30', title: 'Champagne Tower Assembly', role: 'Bar Lead', status: TaskStatus.PENDING },
  { id: '3', time: '16:00', title: 'String Quartet Sound Check', role: 'AV Director', status: TaskStatus.PENDING },
];

const INITIAL_ITEMS: FloorItem[] = [
  { id: '1', type: FurnitureType.TABLE_ROUND, x: 200, y: 200, rotation: 0, label: 'Table 1', guests: 8, assignedStaff: 'Sarah' },
  { id: '2', type: FurnitureType.TABLE_ROUND, x: 400, y: 200, rotation: 0, label: 'Table 2', guests: 8, assignedStaff: 'Mike' },
  { id: '3', type: FurnitureType.TABLE_RECT, x: 300, y: 400, rotation: 90, label: 'Head Table', guests: 12, assignedStaff: 'Emily' },
  { id: '4', type: FurnitureType.DANCE_FLOOR, x: 600, y: 300, rotation: 0, label: 'Dance Floor' },
];

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'James Thompson & Emily White', eventName: 'Thompson-White Wedding', date: '2026-06-15', email: 'emily.white@prestige-holdings.net', phone: '+1 (555) 012-3456', guestCount: 150, contractStatus: 'SIGNED', notes: 'Vegetarian meals required for 12 guests. Band requires 3x3m stage area.' },
  { id: '2', name: 'TechGlobal Corp', eventName: 'Annual Innovators Summit', date: '2026-07-20', email: 'events@techglobal-lux.io', phone: '+1 (555) 098-7654', guestCount: 300, contractStatus: 'PENDING', notes: 'Requires high-speed dedicated internet line and projector setup in main hall.' },
  { id: '3', name: 'Sarah Jenkins', eventName: 'Jenkins 50th Jubilee', date: '2026-08-05', email: 'sarah.j@grand-lumiere.com', phone: '+1 (555) 111-2222', guestCount: 80, contractStatus: 'DRAFT', notes: 'Open bar preferred. Verify liquor license extension.' },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [floorItems, setFloorItems] = useState<FloorItem[]>(INITIAL_ITEMS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(MOCK_CLIENTS[0].id);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [showClientManager, setShowClientManager] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // Derived state for the active client
  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper to add notification
  const addNotification = (message: string, type: NotificationType = 'INFO') => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status: t.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED } 
        : t
    ));
  };

  const addMessage = (msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleGenerateScenario = async () => {
    setIsGenerating(true);
    addNotification("Consulting Intelligence Engine...", "INFO");
    
    const scenario = await generateEventScenario(`Luxury Wedding Reception for ${activeClient.eventName}, 150 guests, indoors`);
    if (scenario) {
      setTasks(scenario.tasks);
      setFloorItems(scenario.floorItems);
      
      addMessage({
        id: Date.now().toString(),
        sender: 'System',
        role: 'AI',
        text: 'New event schematic generated.',
        timestamp: new Date()
      });
      addNotification("Event Blueprint Generated", "SUCCESS");
    } else {
      addNotification("Generation Interrupted. Please retry.", "WARNING");
    }
    setIsGenerating(false);
  };

  const handleOpenClientDetails = () => {
    setShowClientManager(true);
  };

  // Check compliance when toggled
  useEffect(() => {
    if (showCompliance) {
      const hasIssues = floorItems.some(item => {
        return floorItems.some(other => {
           if (other.id === item.id) return false;
           const dx = item.x - other.x;
           const dy = item.y - other.y;
           return Math.sqrt(dx * dx + dy * dy) < 80;
        });
      });

      if (hasIssues) {
        addNotification("Compliance Breach: Egress paths obstructed.", "CRITICAL");
      } else {
        addNotification("Compliance Verification: All zones clear.", "SUCCESS");
      }
    }
  }, [showCompliance, floorItems]);

  // Simulate an urgent message/notification occasionally
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications.length === 0) {
        addNotification("VIP Arrival: The Mayor has entered the South Wing.", "WARNING");
      }
    }, 10000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen bg-stone-100 text-stone-900 flex flex-col overflow-hidden font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Notifications Layer */}
      <Notifications notifications={notifications} removeNotification={removeNotification} />

      {/* Client Manager Modal */}
      <ClientManager 
        clients={clients} 
        isOpen={showClientManager} 
        onClose={() => setShowClientManager(false)}
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
      />

      {/* Luxury Top Navigation Bar */}
      <header className="h-20 bg-white border-b border-stone-200 px-8 flex items-center justify-between shrink-0 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
               <Hexagon size={32} strokeWidth={2} className="text-stone-900" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-['Oswald'] font-medium text-stone-900 text-sm mt-[2px]">L</span>
               </div>
            </div>
            <div>
               <h1 className="font-['Oswald'] text-2xl text-stone-900 tracking-tight leading-none uppercase flex gap-1.5 items-baseline">
                 <span className="font-medium">LUX OPS</span> 
                 <span className="font-light text-stone-700">EVENTS</span>
               </h1>
               <span className="text-[10px] uppercase tracking-[0.2em] text-amber-600 font-bold block mt-0.5 font-sans">Operations Hub</span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-stone-200 mx-2 hidden lg:block"></div>
          
          {/* Real Time Clock */}
          <div className="hidden lg:flex flex-col items-start justify-center">
             <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider">
               <Clock size={12} className="text-amber-600" />
               <span>Local Time</span>
             </div>
             <div className="font-serif text-xl text-stone-800 leading-none mt-0.5 min-w-[100px]">
               {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Client Manager Button */}
           <button 
             onClick={() => setShowClientManager(true)}
             className="px-5 py-2.5 rounded-sm text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-stone-900 flex items-center gap-2 transition-all border border-transparent hover:border-stone-200"
           >
             <Users size={18} className="text-amber-700" /> 
             <span>Concierge</span>
           </button>

           <div className="h-8 w-px bg-stone-200 mx-2"></div>

           {/* Tool Bar */}
           <div className="flex bg-stone-100 p-1 rounded-md border border-stone-200">
             <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all ${
                  showHeatmap ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-800'
                }`}
             >
               <Layers size={16} /> Heatmap
             </button>
             <div className="w-px bg-stone-300 mx-1 my-1"></div>
             <button 
                onClick={() => setShowCompliance(!showCompliance)}
                className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all ${
                  showCompliance ? 'bg-white shadow-sm text-red-700 ring-1 ring-red-100' : 'text-stone-500 hover:text-stone-800'
                }`}
             >
               <ShieldCheck size={16} /> Compliance
             </button>
           </div>

           <button 
              onClick={handleGenerateScenario}
              disabled={isGenerating}
              className="bg-stone-900 hover:bg-stone-800 text-amber-50 px-6 py-2.5 rounded-sm text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-stone-900/10 hover:shadow-stone-900/20 active:translate-y-0.5"
           >
             <Wand2 size={16} className={isGenerating ? "animate-spin text-amber-400" : "text-amber-400"} />
             {isGenerating ? "Processing..." : "AI Planner"}
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Timeline */}
        <aside className="w-[420px] shrink-0 bg-white border-r border-stone-200 h-full z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] hidden md:block">
          <Timeline 
            tasks={tasks} 
            onToggleTask={toggleTask} 
            eventName={activeClient.eventName}
            onTitleClick={handleOpenClientDetails}
          />
        </aside>

        {/* Center: Floor Plan */}
        <main className="flex-1 bg-stone-100 relative p-8 flex flex-col">
          <div className="flex-1 bg-[#FDFBF7] rounded-sm shadow-sm border border-stone-200 overflow-hidden relative ring-1 ring-stone-900/5">
             <FloorPlan 
                items={floorItems} 
                setItems={setFloorItems} 
                showHeatmap={showHeatmap}
                showCompliance={showCompliance}
             />
             
             {/* Mobile Timeline Toggle Warning */}
             <div className="md:hidden absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-sm border shadow-md">
               <span className="text-xs font-bold text-stone-500 tracking-widest">DESKTOP / TABLET ONLY</span>
             </div>
          </div>
        </main>

      </div>

      {/* Persistent Comm Log */}
      <CommunicationLog messages={messages} addMessage={addMessage} />
    </div>
  );
}

export default App;