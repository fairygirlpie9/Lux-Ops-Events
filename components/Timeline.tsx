import React from 'react';
import { Task, TaskStatus } from '../types';
import { CheckCircle2, Circle, Clock, User, ArrowUpRight } from 'lucide-react';

interface TimelineProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  eventName: string;
  onTitleClick: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ tasks, onToggleTask, eventName, onTitleClick }) => {
  // Sort tasks by time
  const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-stone-100 bg-stone-50/30">
        <button 
          onClick={onTitleClick}
          className="group flex items-center gap-2 w-full text-left"
        >
           <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1 block group-hover:text-amber-800 transition-colors">
             {eventName}
           </span>
           <ArrowUpRight size={10} className="text-amber-600 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all mb-1" />
        </button>
        <h2 className="text-2xl font-serif text-stone-900 flex items-center gap-3">
          Run of Show
        </h2>
        <p className="text-xs text-stone-500 mt-2 font-medium italic font-serif">"Excellence in every detail"</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
        {sortedTasks.map((task, index) => {
          const isCompleted = task.status === TaskStatus.COMPLETED;
          const isNext = !isCompleted && (index === 0 || sortedTasks[index - 1].status === TaskStatus.COMPLETED);
          
          return (
            <div 
              key={task.id} 
              className={`relative pl-6 border-l-[1px] transition-all duration-500 py-1 ${
                isCompleted ? 'border-stone-200 opacity-50 blur-[0.5px]' : isNext ? 'border-amber-500' : 'border-stone-200'
              }`}
            >
              {/* Timeline dot */}
              <div className={`absolute -left-[5px] top-3 w-2.5 h-2.5 rounded-full ring-4 ring-white transition-colors duration-500 ${
                 isCompleted ? 'bg-stone-300' : isNext ? 'bg-amber-600 scale-100' : 'bg-stone-300'
              }`}>
              </div>

              <div className="flex justify-between items-start group min-h-[60px]">
                <div className="flex-1 pr-4">
                   <span className={`text-sm font-serif italic ${isNext ? 'text-amber-700 font-bold' : 'text-stone-400'}`}>
                    {task.time}
                   </span>
                   <h3 className={`font-serif text-xl mt-0.5 leading-snug transition-colors ${
                       isCompleted ? 'line-through decoration-stone-300 text-stone-300' : 'text-stone-800'
                   }`}>
                     {task.title}
                   </h3>
                   <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      <span className="bg-stone-100 px-2 py-1 rounded-sm text-stone-600 border border-stone-200">
                        {task.role}
                      </span>
                   </div>
                </div>

                <button 
                  onClick={() => onToggleTask(task.id)}
                  className={`p-3 rounded-full transition-all duration-300 hover:scale-105 ${
                    isCompleted ? 'text-stone-300 bg-stone-50' : 'text-stone-300 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                  aria-label={`Mark ${task.title} as ${isCompleted ? 'pending' : 'completed'}`}
                >
                  {isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} strokeWidth={1.5} />}
                </button>
              </div>
            </div>
          );
        })}
        
        {tasks.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-stone-100 rounded-xl m-4">
            <p className="font-serif text-lg text-stone-400 italic">No scheduled events.</p>
            <p className="text-stone-300 text-xs mt-2">Initialize via AI Planner</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;