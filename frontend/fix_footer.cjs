const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Footer.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Typography
  { regex: /(?<!dark:)text-white(?![\w-])/g, replace: 'text-slate-900 dark:text-white' },
  { regex: /(?<!dark:)text-slate-300(?![\w-])/g, replace: 'text-slate-600 dark:text-slate-300' },
  { regex: /(?<!dark:)text-slate-400(?![\w-])/g, replace: 'text-slate-500 dark:text-slate-400' },
  { regex: /(?<!dark:)text-slate-200(?![\w-])/g, replace: 'text-slate-700 dark:text-slate-200' },
  { regex: /(?<!dark:)text-slate-500(?![\w-])/g, replace: 'text-slate-500 dark:text-slate-500' },
  
  // Backgrounds
  { regex: /(?<!dark:)bg-white\/5(?![\w-])/g, replace: 'bg-slate-50 dark:bg-white/5' },
  { regex: /(?<!dark:)bg-slate-800(?!\/|[\w-])/g, replace: 'bg-white dark:bg-slate-800' },
  { regex: /(?<!dark:)bg-slate-900\/80(?![\w-])/g, replace: 'bg-slate-100/80 dark:bg-slate-900/80' },

  // Borders
  { regex: /(?<!dark:)border-white\/10(?![\w-])/g, replace: 'border-slate-200 dark:border-white/10' },
  { regex: /(?<!dark:)border-white\/5(?![\w-])/g, replace: 'border-slate-200 dark:border-white/5' },
];

replacements.forEach(({ regex, replace }) => {
  content = content.replace(regex, replace);
});

content = content.replace(/hover:text-slate-900 dark:text-white/g, 'hover:text-slate-900 dark:hover:text-white');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Footer.jsx styling for light mode!');
