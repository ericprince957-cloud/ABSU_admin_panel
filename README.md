# 🚀 ABSU Marketplace Admin Panel - Complete Setup

Your admin panel is now fully integrated with your Supabase database using the correct schema.

## ✅ What's Working

### Database Schema (matches your actual setup)
- **users** table - name, email, phone, role, status, etc.
- **products** table - name, description, price, category, image_url, is_active, stock
- **inquiries** table - user_id, product_id, message, status (new/replied/resolved)

### Features
- ✅ Dashboard with stats (users, products, inquiries)
- ✅ Users management (add, edit, delete)
- ✅ Products management (add, edit, delete, activate/deactivate)
- ✅ Inquiries management (view, update status, delete)
- ✅ Password protection (`eric123$`)
- ✅ Naira (₦) currency
- ✅ Real-time Supabase integration
- ✅ Responsive design

## 📋 Setup Steps

### 1. Create Supabase Project
Go to https://supabase.com and create a new project.

### 2. Run Database Schema
1. Go to **SQL Editor** in Supabase
2. Copy the content from `supabase-schema.sql`
3. Paste and click **Run**

### 3. Create `.env` File
Create a file named `.env` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: **Settings → API** in your Supabase dashboard.

### 4. Run the App
```bash
npm run dev
```

### 5. Access the Admin Panel
Visit your URL with the password:
```
https://your-domain.com/?password=eric123$
```

Or just visit the URL and enter `eric123$` on the login screen.

## 🔑 Password
```
eric123$
```

## 📊 Database Tables

### users
- id, name, email, phone, role, status, avatar, whatsapp, bio, store_name
- created_at, updated_at

### products
- id, seller_id, name, description, price, category, image_url
- is_active (boolean), stock
- created_at, updated_at

### inquiries
- id, user_id, product_id, message, status
- created_at, updated_at
- Joins with users and products for display

## 🎯 Key Features

### Dashboard
- Total users count
- Active products count
- Total products count
- Total inquiries count
- Recent products list
- Recent inquiries list

### Users Page
- Add new users
- Edit user details
- Delete users
- Search users

### Products Page
- Add new products
- Toggle active/inactive
- View product details
- Delete products
- Search and filter

### Inquiries Page
- View all inquiries
- Update status (new/replied/resolved)
- Delete inquiries
- Search and filter by status

## 📁 Files

```
src/
├── App.tsx              # Main app with auth & routing
├── components/
│   ├── LoginScreen.tsx  # Password protection
│   └── Sidebar.tsx      # Navigation sidebar
├── lib/
│   ├── config.ts        # Currency & settings
│   ├── db.ts            # Supabase operations
│   └── supabase.ts      # Supabase client
├── pages/
│   ├── Dashboard.tsx    # Overview stats
│   ├── Users.tsx        # User management
│   ├── Products.tsx     # Product management
│   ├── Inquiries.tsx    # Inquiry management
│   └── Settings.tsx     # App settings
└── types/
    └── index.ts         # TypeScript types

supabase-schema.sql      # Database schema
.env.example             # Environment template
SETUP_GUIDE.md           # Detailed setup guide
```

## 🔐 Security Notes

- Password is hardcoded for simple protection
- For production, use Supabase Auth
- Never expose service_role key
- RLS policies are permissive for development

## 🐛 Troubleshooting

### "Supabase not configured" warning
- Check `.env` file exists
- Verify variable names start with `VITE_`
- Restart dev server

### "relation does not exist" error
- Run `supabase-schema.sql` in Supabase SQL Editor

### Data not showing
- Check browser console (F12)
- Verify data in Supabase Table Editor

---

**Ready to use!** 🎉
