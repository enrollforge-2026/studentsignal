import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

const SelectField = ({ label, value, onChange, options, icon, required, placeholder = "Select..." }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#2A2F35' }}>
        {label} {required && <span style={{ color: '#D92D20' }}>*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none" style={{ color: '#6B7280' }}>
            {icon}
          </div>
        )}
        <Select.Root value={value} onValueChange={onChange}>
          <Select.Trigger
            className={`w-full text-sm transition-all ${icon ? 'pl-12' : 'pl-4'} pr-10 flex items-center justify-between`}
            style={{
              height: '48px',
              border: '1px solid #E1E4E8',
              borderRadius: '12px',
              color: value ? '#2A2F35' : '#9CA3AF',
              backgroundColor: 'white',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.border = '2px solid #004C3F';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid #E1E4E8';
            }}
          >
            <Select.Value placeholder={placeholder} />
            <Select.Icon className="ml-2">
              <ChevronDown size={16} style={{ color: '#6B7280' }} />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              className="overflow-hidden bg-white rounded-xl shadow-lg"
              style={{
                border: '1px solid #E1E4E8',
                maxHeight: '280px',
                zIndex: 50
              }}
              position="popper"
              sideOffset={4}
            >
              <Select.Viewport className="p-1">
                {options.map((option) => (
                  <Select.Item
                    key={option.value || option}
                    value={option.value || option}
                    className="relative flex items-center px-8 py-2 text-sm rounded-lg outline-none cursor-pointer select-none"
                    style={{
                      color: '#2A2F35',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F5F7F9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Select.ItemIndicator className="absolute left-2">
                      <Check size={16} style={{ color: '#004C3F' }} />
                    </Select.ItemIndicator>
                    <Select.ItemText>
                      {option.label || option}
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
};

export default SelectField;
