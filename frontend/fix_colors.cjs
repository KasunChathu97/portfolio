const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Home.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The replacements we want to make to support light mode.
// We must be careful not to replace already modified strings (like dark:text-white)
// So we use negative lookbehinds or precise regex.

const replacements = [
  // Typography
  { regex: /(?<!dark:)text-white(?![\w-])/g, replace: 'text-slate-900 dark:text-white' },
  { regex: /(?<!dark:)text-slate-300(?![\w-])/g, replace: 'text-slate-600 dark:text-slate-300' },
  { regex: /(?<!dark:)text-slate-400(?![\w-])/g, replace: 'text-slate-500 dark:text-slate-400' },
  { regex: /(?<!dark:)text-slate-200(?![\w-])/g, replace: 'text-slate-700 dark:text-slate-200' },
  { regex: /(?<!dark:)text-slate-500(?![\w-])/g, replace: 'text-slate-500 dark:text-slate-500' }, // maybe leave this
  
  // Backgrounds
  { regex: /(?<!dark:)bg-white\/5(?![\w-])/g, replace: 'bg-slate-50 dark:bg-white/5' },
  { regex: /(?<!dark:)bg-slate-800(?!\/|[\w-])/g, replace: 'bg-white dark:bg-slate-800' },
  { regex: /(?<!dark:)bg-slate-800\/80(?![\w-])/g, replace: 'bg-white/80 dark:bg-slate-800/80' },
  { regex: /(?<!dark:)bg-slate-800\/50(?![\w-])/g, replace: 'bg-slate-100/50 dark:bg-slate-800/50' },
  { regex: /(?<!dark:)bg-slate-800\/30(?![\w-])/g, replace: 'bg-slate-100/30 dark:bg-slate-800/30' },
  { regex: /(?<!dark:)bg-slate-700\/50(?![\w-])/g, replace: 'bg-slate-200/50 dark:bg-slate-700/50' },
  { regex: /(?<!dark:)bg-slate-900(?![\w-])/g, replace: 'bg-white dark:bg-slate-900' },

  // Borders
  { regex: /(?<!dark:)border-white\/10(?![\w-])/g, replace: 'border-slate-200 dark:border-white/10' },
  { regex: /(?<!dark:)border-white\/5(?![\w-])/g, replace: 'border-slate-200 dark:border-white/5' },
  { regex: /(?<!dark:)border-slate-700(?![\w-])/g, replace: 'border-slate-200 dark:border-slate-700' },
  { regex: /(?<!dark:)border-slate-700\/50(?![\w-])/g, replace: 'border-slate-200/50 dark:border-slate-700/50' },
];

replacements.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

// Since we replaced `hover:text-white` with `hover:text-slate-900 dark:text-white`, we should fix hover states
content = content.replace(/hover:text-slate-900 dark:text-white/g, 'hover:text-slate-900 dark:hover:text-white');
content = content.replace(/group-hover:text-slate-900 dark:text-white/g, 'group-hover:text-slate-900 dark:group-hover:text-white');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Home.jsx styling for light mode!');
