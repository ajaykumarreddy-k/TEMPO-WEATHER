import React from 'react';
import { WeatherState } from '../../services/weatherApi';

export const WeatherInventory = ({ activeSlot, handleSlotClick }: { activeSlot: number, handleSlotClick: (index: number, state?: WeatherState) => void }) => {
  return (
    <div className="voxel-panel p-6">
      <h3 className="font-pixel text-sm mb-4 text-gray-300">WEATHER INVENTORY</h3>
      <div className="bg-[#c6c6c6] p-4 border-4 border-black shadow-[inset_4px_4px_0_#fff,inset_-4px_-4px_0_#555]">
        <div className="grid grid-cols-4 gap-2">
          <div className={`inv-slot ${activeSlot === 0 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(0, 'sunny')} title="Sunny"><img alt="Sun" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3jCSIgtQx3FW6tkMuPWGRL9y61apA_i7Bf1XEVhY0TUkvP8tL-kYaqezIL-7ApT5y8xncrYbDE1loQv4XMX5vZhEmKGiDspJRUFYsmZv9F6gLOT5d-vNTTwavwNmCo8WZQtaxpPxrKiLy_wHlJPLFD9O7vM88LnfnyLxhtMXQ6CLaAPQb7rWDOqR0_qCdN5DCgoGfAQ21YePFlhM5qcQ_rUYJ1Hykkn2ZOxaMAgx0_P0w62KRufIbZjHLozC7ZCigLVRejYKgE50S" width="40" height="40" className="w-6 h-6 sm:w-10 sm:h-10 object-contain" /></div>
          <div className={`inv-slot ${activeSlot === 1 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(1, 'rainy')} title="Rainy"><img alt="Rain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZGmH5bnDTU-pJZe0kH6kU7Wzj3QI2IJfggCVGucgIbRlhNIaBezsf3LM9tWKf6SeumVX07nHTlbae1b8YEBQTAwGuvcPxei3OTqQvRXKD0Duy7GS-w_rcJ4VkooL0wbSU8uS5mnwi9PO6qCw8TXWdyd42j98iaem6OfILzcwSwtJJX7XB8n1xosASdEHApJ9jmYetaZ-9xUFQO_oO827vWCdKEyc_8793RnvEl5KQGhe2Vs87YeHYGi2f7qDqSU_QtMglnCjhyA86" width="40" height="40" className="w-6 h-6 sm:w-10 sm:h-10 object-contain" /></div>
          <div className={`inv-slot ${activeSlot === 2 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(2, 'stormy')} title="Stormy"><img alt="Thunder" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU_VRrTnP0dagCvZM-97ssxoEg5stpOSvGlBu9GmPThR1nUV8b4rbqhV3iBeGPa4hRkZ2d6gZXSYo3owYCOxuiRzcxz8O24zett6-_aBH7dS0OUmqA5IhZA_vw-fZRrr9BNay3gjCzBWGNWHejKT2DUHgvYwTizFFnfygOtYE9eJ-8wOMltbfdoY8fOvmhk2FE1pT338ej7C3rfaqXg_3VH0hJDP6DCKQz-Ro1Wg6AtUdP3vdpLJW1JgSGUuPfQp3KAHHmz50z-LN2" width="40" height="40" className="w-6 h-6 sm:w-10 sm:h-10 object-contain" /></div>
          <div className={`inv-slot ${activeSlot === 3 ? 'active-slot' : ''}`} onClick={() => handleSlotClick(3, 'snowy')} title="Snowy"><img alt="Snow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgjgB9lxdW_EZYI2ycmdD75mmeH9qt_nqTkeutrgaG049hxh41dP5w2r8rTe3ohgg0nR0rWU4h-OH8QBE_rs6h9zESYd4w4nVv-5HpbT2O_MJlw_yD5RMrD8GoYBjMdQhnfJvAFn_h0n6NY8nAAhNnh2PykWxQy0dADRYw0T6eUkvp9ALvXwArOwg2ea3qlJY0JoHgMFOFEzzJGY4pQc9A93ebXXKMadOr4-ddjthJkLMeAvwm90U48kUUEzL_j9EIwQdxUyRV6OHk" width="40" height="40" className="w-6 h-6 sm:w-10 sm:h-10 object-contain" /></div>
          <div className="inv-slot"></div><div className="inv-slot"></div><div className="inv-slot"></div><div className="inv-slot"></div>
        </div>
      </div>
    </div>
  );
};
