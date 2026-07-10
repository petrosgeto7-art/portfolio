const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('C:\\Users\\hp\\Desktop\\petrosportfollio\\src');

const replacements = [
  // index.css specific colors
  [/--color-background:\s*#[0-9a-fA-F]+;/g, '--color-background: #000000;'],
  [/--color-primary:\s*#[0-9a-fA-F]+;/g, '--color-primary: #d97706;'], // amber-600
  [/--color-ring:\s*#[0-9a-fA-F]+;/g, '--color-ring: #fbbf24;'], // amber-400
  [/--color-accent:\s*rgba\([^)]+\);/g, '--color-accent: rgba(217, 119, 6, 0.15);'],
  [/#6366f1/g, '#d97706'], // indigo-500 -> amber-600
  [/#8b5cf6/g, '#fbbf24'], // violet-500 -> amber-400
  [/#818cf8/g, '#fcd34d'], // indigo-400 -> amber-300
  [/#a78bfa/g, '#fde68a'], // violet-400 -> amber-200
  [/rgba\(99,\s*102,\s*241/g, 'rgba(251, 191, 36'], // amber-400 rgb
  [/rgba\(139,\s*92,\s*246/g, 'rgba(252, 211, 77'], // amber-300 rgb
  
  // tailwind gradients
  [/from-indigo-400 via-violet-400 to-purple-400/g, 'from-amber-200 via-yellow-400 to-amber-600'],
  [/from-blue-400 via-indigo-400 to-violet-400/g, 'from-yellow-200 via-amber-400 to-yellow-600'],
  [/from-indigo-500 to-violet-500/g, 'from-amber-500 to-yellow-500'],
  [/text-indigo-400/g, 'text-amber-400'],
  [/text-violet-400/g, 'text-yellow-400'],
  [/text-purple-400/g, 'text-yellow-500'],
  
  // general tailwind classes
  [/indigo-400/g, 'amber-400'],
  [/violet-400/g, 'yellow-400'],
  [/purple-400/g, 'yellow-500'],
  [/indigo-500/g, 'amber-500'],
  [/violet-500/g, 'yellow-500'],
  [/purple-500/g, 'amber-600'],
  [/indigo-600/g, 'amber-600'],
  [/violet-600/g, 'yellow-600'],
  [/purple-600/g, 'yellow-700'],
  [/indigo-900/g, 'amber-900'],
  [/violet-900/g, 'yellow-900'],
  [/purple-900/g, 'amber-950'],
  [/slate-900/g, 'neutral-950'],
  [/slate-800/g, 'neutral-900'],
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});

console.log('Done.');
