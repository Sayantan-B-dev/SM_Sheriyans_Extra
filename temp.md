### for src content
```bash
node -e "
const fs=require('fs'),path=require('path');
function walk(d){
 let r={};
 for(const f of fs.readdirSync(d)){
  if(f==='node_modules') continue;
  const p=path.join(d,f);
  const s=fs.statSync(p);
  if(s.isDirectory()) Object.assign(r, walk(p));
  else if(p.endsWith('.js')) r[p]=fs.readFileSync(p,'utf8');
 }
 return r;
}
fs.writeFileSync('code.json', JSON.stringify(walk('src'), null, 2));
"

```

### for test and `__tests__ <` 
```bash
node -e "
const fs = require('fs');
const path = require('path');
const includeDirs = ['tests'];
const ignoreDirs = ['node_modules', 'src', '.git'];
function walk(dir) {
  let out = {};
  for (const file of fs.readdirSync(dir)) {
    if (ignoreDirs.includes(file)) continue;

    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      Object.assign(out, walk(full));
    } else {
      out[full] = fs.readFileSync(full, 'utf8');
    }
  }
  return out;
}
let result = {};
for (const d of includeDirs) {
  if (fs.existsSync(d)) {
    Object.assign(result, walk(d));
  }
}
fs.writeFileSync('tests-only.json', JSON.stringify(result, null, 2));
console.log('tests-only.json created');
"
```

### prompt
```js
i dont need code..but give me every function algorithm as code block lke
REGISTER USER ALGORITHM: → take username, email, password, fullName(firstName, lastName), role from req.body → check database if a user exists with same username OR email → if exists, return 409 (conflict) → hash password using bcrypt → create user in database with: - hashed password - fullName object - role (default: 'user') → make sure password field in schema has select:false → publish USER_CREATED event to notification queue → publish USER_CREATED event to seller dashboard queue → generate JWT token using: - payload: { id, username, email, role } - secret: JWT_SECRET - expiry: 1 day → store token in httpOnly cookie → set cookie options: - httpOnly: true - secure: true - maxAge: 1 day → return 201 with user details (excluding password)...discuss all functions and syntax in the algorithm itself too..example `FUNCTION sendEmail(to, subject, text, html):
→ async function
→ transporter.sendMail()
     - sends email via SMTP
→ from field:
     - branded sender identity
→ supports:
     - text (fallback)
     - html (rich email)
→ try/catch:
     - prevents email failure from crashing service
→ logs messageId for traceability
`
...keep the file name on top of it..intact..proper structured...
```

### prompt 2
```js
...keep the file name on top of it..intact..proper structured... givethese codes with very detailed on code explaination with comment....give all the code as it is but with a lot of explaination for each and single line
```

### file tree
```bash
find . -path "./node_modules" -prune -o -print | sed 's|[^/]*/|│   |g;s|│   \([^│]\)|├── \1|' > tree.txt

```

### analze.js
`npm i -D @babel/parser @babel/traverse`
```js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const ROOT = process.cwd();
const IGNORE = ['node_modules', '.git'];

function walk(dir) {
    let files = [];
    for (const file of fs.readdirSync(dir)) {
        if (IGNORE.includes(file)) continue;
        const full = path.join(dir, file);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) files.push(...walk(full));
        else if (full.endsWith('.js')) files.push(full);
    }
    return files;
}

function analyze(file) {
    const code = fs.readFileSync(file, 'utf8');

    const ast = parser.parse(code, {
        sourceType: 'unambiguous',
        plugins: ['jsx']
    });

    const info = {
        file: path.relative(ROOT, file),
        imports: [],
        exports: [],
        functionsDefined: [],
        topLevelCalls: []
    };

    traverse(ast, {
        ImportDeclaration({ node }) {
            info.imports.push(node.source.value);
        },

        CallExpression({ node, parent }) {
            if (parent.type === 'ExpressionStatement') {
                if (node.callee.name) {
                    info.topLevelCalls.push(node.callee.name);
                }
            }
        },

        FunctionDeclaration({ node }) {
            info.functionsDefined.push(node.id?.name);
        },

        VariableDeclarator({ node }) {
            if (
                node.init &&
                ['ArrowFunctionExpression', 'FunctionExpression'].includes(node.init.type)
            ) {
                info.functionsDefined.push(node.id.name);
            }
        },

        AssignmentExpression({ node }) {
            if (node.left.object?.name === 'module' && node.left.property?.name === 'exports') {
                info.exports.push('default');
            }
            if (node.left.object?.name === 'exports') {
                info.exports.push(node.left.property.name);
            }
        },

        ExportNamedDeclaration({ node }) {
            node.declaration?.declarations?.forEach(d =>
                info.exports.push(d.id.name)
            );
        },

        ExportDefaultDeclaration() {
            info.exports.push('default');
        }
    });

    return info;
}

const result = walk(ROOT).map(analyze);

fs.writeFileSync(
    'deps.json',
    JSON.stringify(result, null, 2)
);

console.log('Dependency analysis written to deps.json');
```