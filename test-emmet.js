import expand, { extract } from 'emmet';

const line = "m10";
const ext = extract(line, 3, { type: 'stylesheet' });
console.log(ext);
if (ext) {
  console.log(expand(ext.abbreviation, { type: 'stylesheet' }));
}
