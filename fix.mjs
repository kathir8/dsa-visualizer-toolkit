import fs from 'fs';
import * as glob from 'glob';

const files = glob.globSync('src/app/core/algorithms/*.ts');
files.push('src/app/components/visualizer/graph-visualizer.ts');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Since we might have messed up backticks, let's fix them:
  // Find strings that have unbalanced backticks or literal \`
  // Actually, let's revert the files or fix them manually.
  // We can just fix the specific syntax errors angular complained about.
  
  // Replace `\`` with '`' and `\${` with '${' inside the files.
  // Because my initial replace-in-file was: replace-in-file "\\\`" "\`" and it did some matching.
  // Let's just fix all `\`` to '`' and `\${` to '${'.
  content = content.replace(/\\\`/g, '`');
  content = content.replace(/\\\$\{/g, '${');
  
  fs.writeFileSync(f, content);
});
