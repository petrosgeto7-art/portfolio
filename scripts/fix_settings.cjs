const fs = require('fs');
let code = fs.readFileSync('src/components/admin/SettingsForm.tsx', 'utf8');

// The first handleSave is the new API one
// The second handleSave is the old Firebase one
// Let's remove the second one.

const parts = code.split('const handleSave = async () => {');
if (parts.length > 2) {
  // We have multiple handleSaves. Keep the first part and the first handleSave body,
  // then strip out the second handleSave body.
  const oldHandleSaveBodyRegex = /const handleSave = async \(\) => \{[\s\S]*?setSaving\(false\);\s*\};\s*/;
  // Actually simpler: just find the index of the second 'const handleSave = async () => {'
  const secondIndex = code.indexOf('const handleSave = async () => {', code.indexOf('const handleSave = async () => {') + 1);
  if (secondIndex !== -1) {
    const endOfSecondHandleSave = code.indexOf('};', code.indexOf('setSaving(false);', secondIndex)) + 2;
    code = code.substring(0, secondIndex) + code.substring(endOfSecondHandleSave);
  }
}

fs.writeFileSync('src/components/admin/SettingsForm.tsx', code);
