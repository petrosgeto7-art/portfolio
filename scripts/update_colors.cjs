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

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace teal with amber and cyan with yellow
  content = content.replace(/teal-/g, 'amber-');
  content = content.replace(/cyan-/g, 'yellow-');
  content = content.replace(/emerald-/g, 'orange-');
  
  // Also specific hex color if used
  content = content.replace(/14b8a6/g, 'f59e0b'); // teal-500 to amber-500
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
