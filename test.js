import expand, { extract } from 'emmet';
const line = "div.box";
console.log(extract(line, 7, { type: 'markup' }));
