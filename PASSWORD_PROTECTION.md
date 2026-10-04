# 🔐 Password Protection

Your admin panel is now protected with a password.

## How to Access

### Method 1: URL Parameter (Quick Access)
Add the password to the URL:
```
https://your-domain.com/?password=eric123$
```

The password will be automatically removed from the URL after login for security.

### Method 2: Login Screen
If you visit the URL without the password parameter, you'll see a login screen where you can enter the password manually.

## Password
```
eric123$
```

## How It Works

1. **First Visit**: When you visit the URL with `?password=eric123$`, the app:
   - Checks if the password is correct
   - Stores authentication in sessionStorage
   - Removes the password from the URL (for security)
   - Shows the admin panel

2. **Subsequent Visits**: During the same browser session:
   - The app checks sessionStorage for authentication
   - If authenticated, shows the admin panel directly
   - No need to enter password again

3. **New Session**: When you close the browser or open a new tab:
   - sessionStorage is cleared
   - You'll need to enter the password again (via URL or login screen)

## Security Notes

- ⚠️ **Not for production use**: This is a simple password check, not real authentication
- 🔒 **sessionStorage**: Authentication is stored in sessionStorage (cleared when browser closes)
- 🚫 **No encryption**: The password is stored in plain text in the code
- 📝 **For demo/testing only**: Use proper authentication (like Supabase Auth) for production

## Changing the Password

To change the password, edit these two locations in the code:

1. `src/App.tsx` - Line 13:
   ```typescript
   const ADMIN_PASSWORD = 'eric123$';
   ```

2. `src/components/LoginScreen.tsx` - Line 7:
   ```typescript
   const ADMIN_PASSWORD = 'eric123$';
   ```

Change both to your new password.

## For Production

If you want real authentication for production:

1. Use **Supabase Auth** (already integrated)
2. Set up user accounts with email/password
3. Add role-based access control
4. Use proper session management
5. Implement logout functionality

See the Supabase documentation for setting up authentication:
https://supabase.com/docs/guides/auth

---

**Current Setup**: Simple password protection for demo/testing purposes ✅
