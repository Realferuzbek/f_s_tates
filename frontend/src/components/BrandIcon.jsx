export default function BrandIcon({ size = 28, className = '', label = 'F-S Tates icon' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 257"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="brand-icon-gradient" x1="0" y1="0" x2="256" y2="257" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C7CFF" />
          <stop offset="0.5" stopColor="#6BC4FF" />
          <stop offset="1" stopColor="#EC4ECF" />
        </linearGradient>
        <linearGradient id="brand-icon-bolt" x1="132.27" y1="30.9" x2="74.64" y2="187.33" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE56A" />
          <stop offset="1" stopColor="#FFB115" />
        </linearGradient>
      </defs>
      <path
        d="M12.51 42.58 112.13 230.08c4.5 8.6 16.7 8.6 21.2 0l99.6-187.5c3.9-7.4-3.4-15.7-11.3-13.2L132.3 57.2c-7.6 2.5-15.9 2.5-23.5 0L23.8 29.36c-7.9-2.44-15.2 5.79-11.29 13.22Z"
        fill="url(#brand-icon-gradient)"
      />
      <path
        d="m156.636 71.147-65.211 77.104c-1.884 2.249.536 5.438 3.307 4.38l44.439-16.752a.75.75 0 0 1 .433 1.3l-20.553 70.012c-.76 2.551 2.522 3.991 4.104 1.801l66.05-89.114c1.856-2.481-1.158-5.56-3.862-4.292l-44.128 20.762a.75.75 0 0 1-1.442-.283l21.579-71.315c.802-2.668-2.749-4.74-4.712-2.631l-1.003 1.092v8.936Z"
        fill="url(#brand-icon-bolt)"
      />
    </svg>
  );
}
