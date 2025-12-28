### for src content
```
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

```
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
```
i dont need code..but give me every function algorithm as code block lke
REGISTER USER ALGORITHM: → take username, email, password, fullName(firstName, lastName), role from req.body → check database if a user exists with same username OR email → if exists, return 409 (conflict) → hash password using bcrypt → create user in database with: - hashed password - fullName object - role (default: 'user') → make sure password field in schema has select:false → publish USER_CREATED event to notification queue → publish USER_CREATED event to seller dashboard queue → generate JWT token using: - payload: { id, username, email, role } - secret: JWT_SECRET - expiry: 1 day → store token in httpOnly cookie → set cookie options: - httpOnly: true - secure: true - maxAge: 1 day → return 201 with user details (excluding password)
...keep the file name on top of it..intact..proper structured...
```