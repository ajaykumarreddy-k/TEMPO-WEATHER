import React from 'react';

export const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="voxel-panel p-8 w-[400px] max-w-[90vw] border-4 border-black bg-[#c6c6c6] shadow-[inset_4px_4px_0_#fff,inset_-4px_-4px_0_#555]">
         <h2 className="font-pixel text-xl mb-8 text-black text-center border-b-2 border-gray-500 pb-4">SETTINGS</h2>
         <div className="space-y-4">
           <div className="flex justify-between items-center">
             <span className="font-pixel text-xs text-black">Graphics</span>
             <button className="voxel-panel bg-stone-500 px-4 py-2 font-pixel text-[10px] text-white">FANCY</button>
           </div>
           <div className="flex justify-between items-center">
             <span className="font-pixel text-xs text-black">Particles</span>
             <button className="voxel-panel bg-stone-500 px-4 py-2 font-pixel text-[10px] text-white">ALL</button>
           </div>
           <div className="flex justify-between items-center">
             <span className="font-pixel text-xs text-black">Temp Unit</span>
             <button className="voxel-panel bg-stone-500 px-4 py-2 font-pixel text-[10px] text-white">CELSIUS</button>
           </div>
         </div>
         <button onClick={onClose} className="voxel-panel w-full py-3 mt-8 bg-stone-500 hover:bg-stone-400 text-white font-pixel text-sm transition-colors">DONE</button>
      </div>
    </div>
  );
};
