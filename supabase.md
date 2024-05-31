# use supabase

1. nextjs-supabase 앱 설치
```powershell
npx create-next-app -e with-supabase
```
이미 nextjs 앱을 설치한 경우, npm으로 패키지를 설치한다
```text
npm install @supabase/supabase-js
```

2. .env.local 환경변수 추가
```text
NEXT_PUBLIC_SUPABASE_URL=<SUBSTITUTE_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUBSTITUTE_SUPABASE_ANON_KEY>
```
3. supabase 설정
```js
// lib/client.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```
>https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
