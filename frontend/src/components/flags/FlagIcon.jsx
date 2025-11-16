import { useId } from 'react';

const FLAG_SIZE = 34;

export default function FlagIcon({ code, active = false }) {
  const clipId = useId();

  const renderFlag = () => {
    switch (code) {
      case 'ru':
        return (
          <>
            <rect width="40" height="40" fill="#ffffff" />
            <rect width="40" height="26.67" fill="#1c3aa9" y="13.33" />
            <rect width="40" height="13.33" fill="#d32f2f" y="26.67" />
          </>
        );
      case 'uz':
        return (
          <>
            <rect width="40" height="40" fill="#0097d7" />
            <rect width="40" height="10" fill="#ffffff" y="12" />
            <rect width="40" height="3" fill="#e53935" y="22" />
            <rect width="40" height="10" fill="#43a047" y="25" />
            <circle cx="9" cy="9" r="4" fill="#ffffff" />
            <circle cx="11" cy="9" r="3.2" fill="#0097d7" />
            <circle cx="9" cy="9" r="2.2" fill="#ffffff" />
          </>
        );
      case 'en':
      default:
        return (
          <>
            {[...Array(13)].map((_, index) => (
              <rect key={String(index)} width="40" height="3.08" y={index * 3.08} fill={index % 2 === 0 ? '#b22234' : '#ffffff'} />
            ))}
            <rect width="20" height="16" fill="#3c3b6e" />
            {[...Array(9)].map((_, row) =>
              [...Array(row % 2 === 0 ? 6 : 5)].map((__, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={3 + col * 3.2 + (row % 2 === 0 ? 0 : 1.6)}
                  cy={2.5 + row * 1.8}
                  r="0.6"
                  fill="#ffffff"
                />
              ))
            )}
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 40 40"
      width={FLAG_SIZE}
      height={FLAG_SIZE}
      className={`transition ${active ? 'scale-[1.03]' : 'opacity-90 group-hover:opacity-100'}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="20" cy="20" r="17" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>{renderFlag()}</g>
      <circle cx="20" cy="20" r="17" fill="none" stroke={active ? '#ffffff' : '#cbd5f5'} strokeWidth="2" />
    </svg>
  );
}
