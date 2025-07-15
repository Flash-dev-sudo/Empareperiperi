# Admin Security Documentation

## Security Features Implemented

### 1. Password Protection
- Admin password stored in environment variable `ADMIN_PASSWORD` (fallback: "emparo2025")
- Password verification happens on the server-side
- No password visible in client-side code

### 2. Session-Based Authentication
- Server-side sessions with secure cookies
- Session expires after 2 hours of inactivity
- Session invalidated on logout

### 3. Rate Limiting
- Maximum 5 failed login attempts per session
- 15-minute lockout period after exceeding limit
- Failed attempts tracked per session

### 4. IP Address Tracking
- Login IP address logged for security monitoring
- IP address mismatch detection (optional security layer)
- All login attempts logged with timestamps

### 5. Protected Routes
- All admin menu management routes protected with authentication middleware
- Unauthorized access returns 401 status
- Session validation on every admin request

### 6. Security Logging
- All login attempts (successful and failed) logged with IP and timestamp
- Failed login attempts tracked and logged
- Session timeout events logged

## Access Control

### For Page Owner Only:
1. **Direct URL Access**: Admin page only accessible via `/admin` (not linked in public navigation)
2. **Password Protection**: Requires correct password to access
3. **Session Management**: Must stay logged in during session
4. **IP Tracking**: Login IP recorded for security monitoring

### Environment Variables:
- `ADMIN_PASSWORD`: Set this to your secure password (default: "emparo2025")
- `SESSION_SECRET`: Set this for session encryption security

### Security Best Practices:
1. Change the default password by setting `ADMIN_PASSWORD` environment variable
2. Use a strong, unique password
3. Set a secure `SESSION_SECRET` environment variable
4. Monitor login logs for suspicious activity
5. Logout when finished with admin tasks

## Additional Security Measures You Can Add:

### 1. IP Whitelisting
- Restrict admin access to specific IP addresses
- Useful for fixed office/home IP addresses

### 2. Two-Factor Authentication
- Add email/SMS verification for admin login
- Requires additional verification step

### 3. Access Time Restrictions
- Allow admin access only during business hours
- Automatically deny access outside specified times

### 4. Admin Activity Logging
- Log all admin actions (add/edit/delete menu items)
- Track changes with timestamps and IP addresses

### 5. Password Complexity Requirements
- Enforce minimum password length and complexity
- Regular password rotation reminders

## Current Implementation Status:
✅ Password protection
✅ Session-based authentication  
✅ Rate limiting
✅ IP tracking and logging
✅ Protected API routes
✅ Secure session management
✅ Server-side password verification