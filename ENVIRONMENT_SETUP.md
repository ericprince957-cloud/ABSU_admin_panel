# Environment Variables Setup

## ⚠️ Important: Vite vs Next.js

This project uses **Vite**, not Next.js. The environment variable syntax is different:

| Framework | Syntax | Example |
|-----------|--------|---------|
| **Next.js** | `process.env.NEXT_PUBLIC_*` | `process.env.NEXT_PUBLIC_SUPABASE_URL` |
| **Vite** | `import.meta.env.VITE_*` | `import.meta.env.VITE_SUPABASE_URL` |

## How to Set Up

### 1. Create `.env` file in project root

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: 
- Variables MUST start with `VITE_` to be accessible in the browser
- Do NOT use `NEXT_PUBLIC_` - that's for Next.js only
- Do NOT use quotes around the values

### 2. Get Your Credentials from Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy these values:
   - **Project URL** → paste as `VITE_SUPABASE_URL`
   - **anon public key** → paste as `VITE_SUPABASE_ANON_KEY`

### 3. Restart Development Server

After creating or modifying `.env`, you MUST restart the dev server:

```bash
# Stop the server (Ctrl+C)
# Then start it again
npm run dev
```

## Example `.env` File

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAwMDAwMDAwMH0.example-signature-here
```

## Common Mistakes

❌ **Wrong**: Using Next.js syntax in Vite
```env
NEXT_PUBLIC_SUPABASE_URL=...  # WRONG!
```

✅ **Correct**: Using Vite syntax
```env
VITE_SUPABASE_URL=...  # CORRECT!
```

❌ **Wrong**: Missing VITE_ prefix
```env
SUPABASE_URL=...  # WRONG! Won't be accessible
```

✅ **Correct**: With VITE_ prefix
```env
VITE_SUPABASE_URL=...  # CORRECT!
```

❌ **Wrong**: Using quotes
```env
VITE_SUPABASE_URL="https://..."  # WRONG!
```

✅ **Correct**: No quotes
```env
VITE_SUPABASE_URL=https://...  # CORRECT!
```

## Verification

To check if your environment variables are loaded:

1. Open browser console (F12)
2. Type: `console.log(import.meta.env)`
3. You should see your `VITE_*` variables listed

## Security Note

- ✅ `anon` key is safe to expose in frontend code
- ❌ Never use `service_role` key in frontend (it bypasses security)
- ✅ The `.env` file is already in `.gitignore`

## Troubleshooting

### "Supabase credentials not found" warning
- Check that `.env` file exists in project root (not in `src/`)
- Verify variable names start with `VITE_`
- Restart the dev server after creating `.env`

### Variables showing as `undefined`
- Make sure you restarted the dev server
- Check for typos in variable names
- Ensure no extra spaces or quotes in `.env`

### Still not working?
- Delete `node_modules/.vite` folder and restart
- Clear browser cache
- Check browser console for errors
