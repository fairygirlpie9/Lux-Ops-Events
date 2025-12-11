import React, { useState } from 'react';
import { Client, ContractStatus } from '../types';
import { Search, FileText, Calendar, Mail, Phone, User, Check, X, Briefcase } from 'lucide-react';

interface ClientManagerProps {
  clients: Client[];
  isOpen: boolean;
  onClose: () => void;
  selectedClientId: string | null;
  onSelectClient: (id: string) => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({ clients, isOpen, onClose, selectedClientId, onSelectClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-sm shadow-2xl flex overflow-hidden ring-1 ring-white/20">
        
        {/* Left Sidebar: Client List */}
        <div className="w-[340px] bg-stone-50 border-r border-stone-200 flex flex-col">
          <div className="p-5 border-b border-stone-200 bg-white">
            <h2 className="text-xl font-serif text-stone-900 mb-4">Guest List</h2>
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 text-stone-400 group-focus-within:text-amber-600 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search database..."
                className="w-full bg-stone-100 border-none rounded-sm pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-amber-500/30 focus:bg-white transition-all outline-none placeholder:text-stone-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredClients.map(client => (
              <div 
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={`p-4 border-b border-stone-100 cursor-pointer transition-all duration-200 ${
                  selectedClientId === client.id ? 'bg-white border-l-[3px] border-l-amber-600 shadow-sm' : 'hover:bg-stone-100 border-l-[3px] border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-serif text-base ${selectedClientId === client.id ? 'text-stone-900 font-bold' : 'text-stone-700'}`}>
                    {client.name}
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 truncate">{client.eventName}</p>
                <div className="flex items-center justify-between mt-1">
                   <p className="text-xs text-stone-500 font-serif italic">{new Date(client.date).toLocaleDateString()}</p>
                   {client.contractStatus === 'SIGNED' && <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">Signed</span>}
                   {client.contractStatus === 'PENDING' && <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">Pending</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content: Details */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedClient ? (
            <>
              {/* Header */}
              <div className="p-8 border-b border-stone-100 flex justify-between items-start bg-stone-50/30">
                <div>
                   <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-2 block">Event Dossier</span>
                   <h1 className="text-3xl font-serif text-stone-900">{selectedClient.eventName}</h1>
                   <div className="flex items-center gap-2 mt-2 text-stone-500 text-base font-light">
                      <User size={16} />
                      {selectedClient.name}
                   </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                    <X size={20} className="text-stone-400 hover:text-stone-900" />
                  </button>
                  <div className="flex gap-2">
                     <button className="px-3 py-2 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-black transition-colors">
                        Edit Profile
                     </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 grid grid-cols-2 gap-8 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                {/* Event Details Card */}
                <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100">
                  <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar size={12} className="text-amber-600" /> Logistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-stone-50 pb-3">
                      <label className="text-[10px] text-stone-400 font-bold uppercase">Date</label>
                      <span className="text-base font-serif text-stone-800">{new Date(selectedClient.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-50 pb-3">
                      <label className="text-[10px] text-stone-400 font-bold uppercase">Headcount</label>
                      <span className="text-base font-serif text-stone-800">{selectedClient.guestCount} Guests</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 font-bold uppercase mb-2 block">Special Instructions</label>
                      <p className="text-sm text-stone-600 leading-relaxed font-light bg-stone-50 p-3 rounded-sm border border-stone-100 italic">"{selectedClient.notes}"</p>
                    </div>
                  </div>
                </div>

                {/* Contact & Contract Card */}
                <div className="space-y-6">
                   <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100">
                      <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Briefcase size={12} className="text-amber-600" /> Contact & Access
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                              <Mail size={14} />
                           </div>
                           <div>
                              <label className="text-[9px] font-bold uppercase text-stone-400 block">Email Address</label>
                              <a href={`mailto:${selectedClient.email}`} className="text-sm text-stone-800 hover:text-amber-600 border-b border-stone-200 hover:border-amber-600 transition-all">{selectedClient.email}</a>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                              <Phone size={14} />
                           </div>
                           <div>
                              <label className="text-[9px] font-bold uppercase text-stone-400 block">Direct Line</label>
                              <span className="text-sm text-stone-800 font-mono">{selectedClient.phone}</span>
                           </div>
                        </div>
                      </div>
                   </div>

                   <div className="bg-stone-900 text-stone-200 p-6 rounded-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10">
                        <FileText size={80} />
                      </div>
                      <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                         Contract Status: {selectedClient.contractStatus}
                      </h3>
                      
                      <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 rounded-sm font-semibold hover:bg-white/20 transition-all text-left px-4 flex justify-between items-center relative z-10 mb-3 group text-sm">
                         <span className="group-hover:translate-x-1 transition-transform">Master_Service_Agreement.pdf</span>
                         <FileText size={16} className="opacity-70" />
                      </button>
                      <div className="flex gap-2 relative z-10">
                         <button className="flex-1 bg-amber-600 text-white py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-amber-700 transition-colors">Resend</button>
                         <button className="flex-1 bg-transparent border border-stone-600 text-stone-400 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider hover:border-stone-400 hover:text-white transition-colors">Archive</button>
                      </div>
                   </div>
                </div>
              </div>

            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-300">
               <User size={48} className="mb-4 opacity-20" />
               <p className="font-serif italic text-lg opacity-50">Select a client dossier to view details</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ClientManager;