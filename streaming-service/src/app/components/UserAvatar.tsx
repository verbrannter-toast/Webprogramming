import React from 'react';

type UserAvatarProps = {
  avatarUrl?: string | null;
  sizeClass?: string;
  className?: string;
  alt?: string;
};

export default function UserAvatar({
  avatarUrl,
  sizeClass = 'w-24 h-24',
  className = '',
  alt = 'avatar'
}: UserAvatarProps) {
  return (
    <img
      src={avatarUrl || '/assets/avatar-default-svgrepo-com.svg'}
      alt={alt}
      className={`${sizeClass} rounded-full object-cover border border-zinc-700 ${className}`.trim()}
    />
  );
}
