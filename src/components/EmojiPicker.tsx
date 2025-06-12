
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const emojis = [
    // Work & Technology
    '📝', '🚀', '💡', '⚡', '🔧', '💻', '📱', '🌐', '🎯', '📊',
    '🎨', '🛠️', '⭐', '🔥', '💎', '🏆', '🎉', '📈', '🎮', '🔮',
    '💰', '💳', '💸', '📉', '📋', '📌', '📎', '🔒', '🔓', '🔑',
    
    // Transportation & Places
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
    '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🚁', '✈️',
    '🛩️', '🛸', '🚤', '⛵', '🚢', '⚓', '🚉', '🚇', '🚈', '🚝',
    
    // Buildings & Objects
    '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪',
    '🏫', '🏬', '🏭', '🏯', '🏰', '🗼', '🗽', '⛪', '🕌', '🛕',
    
    // Food & Drinks
    '🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚',
    '🍳', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍿',
    '☕', '🫖', '🍵', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷',
    
    // Activities & Entertainment
    '🎵', '🎶', '🎼', '🎹', '🥁', '🎸', '🎺', '🎷', '🪕', '🎻',
    '📚', '📖', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📰',
    '🎲', '🎯', '🎱', '🎳', '🎮', '🕹️', '🎰', '🎪', '🎭', '🎨',
    
    // Nature & Animals
    '🌟', '⭐', '🌙', '☀️', '🌈', '☁️', '⛅', '🌤️', '⛈️', '🌩️',
    '❄️', '☃️', '⛄', '🌊', '💧', '🔥', '🌋', '🏔️', '⛰️', '🗻',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    
    // Sports & Hobbies
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
    '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁',
    
    // Symbols & Signs
    '✨', '💫', '⭐', '🌟', '✅', '❌', '⚠️', '🔴', '🟠', '🟡',
    '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '💯', '🔢', '#️⃣', '*️⃣',
    
    // Hearts & Expressions
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💗',
    '💓', '💕', '💖', '💘', '💝', '💟', '♥️', '💔', '❣️', '💋'
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-16 h-10 text-lg"
          type="button"
        >
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2 max-h-64 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {emojis.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              className="w-8 h-8 p-0 text-lg hover:bg-gray-100"
              onClick={() => {
                onChange(emoji);
                setIsOpen(false);
              }}
              type="button"
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
