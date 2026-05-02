import { useEffect, useRef, useState } from 'react';

export function useInlineEditor(onAdd: (title: string) => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed) onAdd(trimmed);
    setTitle('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      setTitle('');
      setIsEditing(false);
    }
  };

  return {
    isEditing,
    title,
    inputRef,
    setTitle,
    handleSubmit,
    handleKeyDown,
    startEditing: () => setIsEditing(true),
    cancelEditing: () => {
      setTitle('');
      setIsEditing(false);
    },
  };
}
