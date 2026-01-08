export default function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      
      <rect x="10.5" y="0.5" width="3" height="3.5" rx="1.5" fill="currentColor" />
      <rect x="10.5" y="20" width="3" height="3.5" rx="1.5" fill="currentColor" />
      <rect x="0.5" y="10.5" width="3.5" height="3" rx="1.5" fill="currentColor" />
      <rect x="20" y="10.5" width="3.5" height="3" rx="1.5" fill="currentColor" />
      
      <g transform="translate(12, 12) rotate(45)">
        <rect x="7.5" y="-1.5" width="3.5" height="3" rx="1.5" fill="currentColor" />
      </g>
      <g transform="translate(12, 12) rotate(-45)">
        <rect x="7.5" y="-1.5" width="3.5" height="3" rx="1.5" fill="currentColor" />
      </g>
      <g transform="translate(12, 12) rotate(135)">
        <rect x="7.5" y="-1.5" width="3.5" height="3" rx="1.5" fill="currentColor" />
      </g>
      <g transform="translate(12, 12) rotate(-135)">
        <rect x="7.5" y="-1.5" width="3.5" height="3" rx="1.5" fill="currentColor" />
      </g>
    </svg>
  );
}
