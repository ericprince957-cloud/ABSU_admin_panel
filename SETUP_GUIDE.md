# Supabase Setup Guide

This guide will walk you through connecting your Admin Panel to Supabase.

## Table of Contents
1. [Create Supabase Project](#1-create-supabase-project)
2. [Get Your Credentials](#2-get-your-credentials)
3. [Set Up Environment Variables](#3-set-up-environment-variables)
4. [Create Database Tables](#4-create-database-tables)
5. [Test the Connection](#5-test-the-connection)
6. [Deploy to Production](#6-deploy-to-production)

---

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: Your project name (e.g., "Admin Panel")
   - **Database Password**: Create a strong password (save it somewhere safe!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is fine to start
5. Click **"Create new project"**
6. Wait for the project to be provisioned (takes ~2 minutes)

---

## 2. Get Your Credentials

Once your project is ready:

1. Go to your project dashboard
2. Click **"Settings"** in the left sidebar (gear icon)
3. Click **"API"**
4. You'll see two important values:
   - **Project URL**: Looks like `https://abcdefg.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`

**Copy both values** - you'll need them in the next step.

---

## 3. Set Up Environment Variables

1. In your project root, create a file named `.env` (not `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: 
- Replace the values with your actual credentials from Step 2
- The `.env` file is already in `.gitignore`, so it won't be committed to git
- Never commit your `.env` file to version control!

---

## 4. Create Database Tables

You need to run the SQL schema to create the database tables.

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Open the `supabase-schema.sql` file in this project
5. Copy all the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
8. You should see "Success. No rows returned" for each statement

### Option B: Using Supabase Dashboard UI

If you prefer a visual interface:

1. Go to **"Table Editor"** in the left sidebar
2. Click **"New Table"**
3. Create the following tables manually:

#### users table:
- id (uuid, primary key, default: gen_random_uuid())
- name (text, not null)
- email (text, not null, unique)
- phone (text, not null)
- role (text, not null, default: 'student')
- status (text, not null, default: 'pending')
- avatar (text)
- whatsapp (text)
- bio (text)
- store_name (text)
- created_at (timestamp with time zone, default: now())
- updated_at (timestamp with time zone, default: now())

#### products table:
- id (uuid, primary key, default: gen_random_uuid())
- seller_id (uuid, foreign key to users.id)
- seller_name (text, not null)
- title (text, not null)
- description (text, not null)
- price (decimal, not null)
- category (text, not null)
- images (text array)
- status (text, not null, default: 'pending')
- stock (integer, not null, default: 1)
- condition (text, not null, default: 'new')
- created_at (timestamp with time zone, default: now())
- updated_at (timestamp with time zone, default: now())

#### orders table:
- id (uuid, primary key, default: gen_random_uuid())
- buyer_id (uuid, foreign key to users.id)
- buyer_name (text, not null)
- seller_id (uuid, foreign key to users.id)
- seller_name (text, not null)
- product_id (uuid, foreign key to products.id)
- product_title (text, not null)
- quantity (integer, not null, default: 1)
- total_price (decimal, not null)
- status (text, not null, default: 'pending')
- payment_method (text, not null, default: 'whatsapp')
- notes (text)
- created_at (timestamp with time zone, default: now())
- updated_at (timestamp with time zone, default: now())

---

## 5. Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to the admin panel

3. You should see a yellow warning banner if Supabase is not configured. If you don't see it, your connection is working!

4. Try adding a person:
   - Go to "People" page
   - Click "Add Person"
   - Fill in the form
   - Click "Add Person"

5. Check your Supabase dashboard:
   - Go to **"Table Editor"**
   - Click on **"users"** table
   - You should see your new user there!

---

## 6. Deploy to Production

When you're ready to deploy:

### Environment Variables in Production

You need to set the environment variables in your hosting platform:

#### Vercel:
1. Go to your project settings
2. Click **"Environment Variables"**
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy your project

#### Netlify:
1. Go to site settings
2. Click **"Environment variables"**
3. Add the same variables
4. Redeploy

#### Other platforms:
Check your hosting provider's documentation for setting environment variables.

---

## Troubleshooting

### "Supabase not configured" warning appears

- Check that your `.env` file exists in the project root
- Verify the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Make sure there are no extra spaces or quotes around the values
- Restart your dev server after creating/updating `.env`

### "relation does not exist" error

- You need to run the SQL schema first (Step 4)
- Go to Supabase SQL Editor and run `supabase-schema.sql`

### "new row violates row-level security policy" error

- The SQL schema includes permissive RLS policies
- If you modified the policies, you may need to update them
- For development, the default policies allow all operations

### Data not showing up after adding

- Check the browser console for errors (F12 → Console tab)
- Verify the data exists in Supabase Table Editor
- Make sure you're looking at the correct Supabase project

---

## Security Notes

### For Production:

1. **Row Level Security (RLS)**: The current schema uses permissive policies for development. In production, you should:
   - Set up proper authentication
   - Restrict access based on user roles
   - Only allow admins to perform certain operations

2. **API Keys**: 
   - The `anon` key is safe to expose in frontend code
   - Never use the `service_role` key in frontend code
   - The `service_role` key bypasses RLS and should only be used in backend code

3. **Backups**: Enable automatic backups in Supabase project settings

4. **Monitoring**: Set up monitoring and alerts for unusual activity

---

## Next Steps

After connecting to Supabase:

1. ✅ Test all CRUD operations (Create, Read, Update, Delete)
2. ✅ Verify data persists across page reloads
3. ✅ Test adding people, products, and orders
4. ✅ Verify the verify/ban/unban functionality works
5. ✅ Test the bulk actions (approve all, reject all, etc.)
6. ✅ Deploy to production with environment variables

---

## Support

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Check the browser console for error messages
3. Verify your Supabase project is active and not paused
4. Make sure your environment variables are correctly set

---

## Summary

You now have:
- ✅ Supabase client configured in `src/lib/supabase.ts`
- ✅ Database schema in `supabase-schema.sql`
- ✅ Environment variables template in `.env.example`
- ✅ All database operations updated to use Supabase
- ✅ This setup guide

**Next**: Follow Steps 1-5 above to complete the setup!
