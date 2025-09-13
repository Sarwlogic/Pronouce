
import React from 'react';

const RobotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2a2 2 0 0 0-2 2v2H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2V4a2 2 0 0 0-2-2zM8 10h8v7H8v-7zm2-5h4v1H10V5z" />
    <circle cx="9.5" cy="13.5" r="1.5" />
    <circle cx="14.5" cy="13.5" r="1.5" />
  </svg>
);

export default RobotIcon;
