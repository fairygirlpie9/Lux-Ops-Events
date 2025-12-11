import React from 'react';
import { Notification } from '../types';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

interface NotificationsProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col gap-4 w-[90%] max-w-xl pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`pointer-events-auto flex items-stretch overflow-hidden rounded-sm shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-500 border-l-4 ${
            notif.type === 'CRITICAL' ? 'bg-white border-l-red-600' :
            notif.type === 'WARNING' ? 'bg-white border-l-amber-500' :
            notif.type === 'SUCCESS' ? 'bg-white border-l-emerald-600' :
            'bg-stone-900 border-l-stone-500 text-white'
          }`}
        >
          <div className="p-4 flex items-start gap-4 flex-1">
             <div className="shrink-0 mt-0.5">
               {notif.type === 'CRITICAL' && <AlertCircle size={20} className="text-red-600" />}
               {notif.type === 'WARNING' && <AlertTriangle size={20} className="text-amber-500" />}
               {notif.type === 'SUCCESS' && <CheckCircle size={20} className="text-emerald-600" />}
               {notif.type === 'INFO' && <Info size={20} className="text-stone-400" />}
             </div>
             
             <div className="flex-1">
               <h4 className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1 ${
                   notif.type === 'INFO' ? 'text-stone-400' : 'text-stone-400'
               }`}>
                   {notif.type} MESSAGE
               </h4>
               <p className={`font-serif text-lg leading-tight ${
                   notif.type === 'INFO' ? 'text-stone-100' : 'text-stone-800'
               }`}>
                   {notif.message}
               </p>
               <span className="text-[10px] opacity-40 mt-2 block font-mono">{notif.timestamp.toLocaleTimeString()}</span>
             </div>
          </div>

          <button 
            onClick={() => removeNotification(notif.id)}
            className={`px-3 hover:bg-black/5 transition-colors flex items-center justify-center border-l ${
                notif.type === 'INFO' ? 'border-stone-700 hover:bg-white/10' : 'border-stone-100'
            }`}
          >
            <X size={16} className="opacity-50 hover:opacity-100" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;