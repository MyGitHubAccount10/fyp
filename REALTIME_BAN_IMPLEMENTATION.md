# Real-Time User Ban/Redirect Implementation

## Overview
This implementation allows administrators to ban users and automatically redirect them out of the admin panel in real-time using WebSocket communication.

## How It Works

### 1. Socket.IO Connection
- When an admin user logs in, a Socket.IO connection is established
- Each user's socket connection is mapped to their user ID on the backend
- The connection is initialized in `AdminHeader.js` when the component mounts

### 2. Real-Time Ban Process
1. **Admin bans a user**: Click the ban button in the All Customers page
2. **API call**: Makes a PATCH request to `/api/user/:id/ban`
3. **Socket emission**: Emits a `ban_user` event with the target user's ID
4. **Server relay**: Backend receives the event and sends it to the banned user's socket
5. **Client handling**: Banned user receives `user_banned` event and is immediately redirected

### 3. Automatic Redirect
When a user receives the ban notification:
- Their admin session data is cleared from localStorage
- An alert is shown informing them of the ban
- They are redirected to the homepage (`/`)
- The socket connection is terminated

## Files Modified/Created

### Frontend Files:
1. **`src/services/socketService.js`** - Socket.IO client service
2. **`src/components/WithAuthCheck.js`** - Higher-order component for periodic auth checking
3. **`src/AdminHeader.js`** - Modified to initialize socket connection
4. **`src/AdminSide/D_AllCustomersPage.js`** - Updated ban function to emit socket events
5. **`src/AdminSide/TestBanPage.js`** - Test page to demonstrate functionality
6. **`src/App.js`** - Added test route

### Backend Files:
1. **`socketHandler.js`** - Socket.IO server logic
2. **`server.js`** - Updated to include Socket.IO initialization
3. **`.env`** - Added socket URL configuration

### Dependencies Added:
- Frontend: `socket.io-client`
- Backend: `socket.io`

## Testing the Implementation

### Method 1: Test Page
1. Navigate to `/test-ban` (requires admin login)
2. Open multiple browser tabs with different admin accounts
3. Ban one of the logged-in users
4. Observe the banned user being redirected immediately

### Method 2: All Customers Page
1. Open multiple admin sessions in different browser tabs/windows
2. Go to `/all-customers` in each
3. Use one admin to ban another admin
4. The banned admin should be immediately redirected

## Security Features

1. **Permission-based banning**: Regular admins can only ban customers, Super Admins can ban anyone
2. **Session cleanup**: Banned users' session data is completely cleared
3. **Backup auth checking**: Periodic status checking as a fallback (every 30 seconds)
4. **Higher-order component**: `WithAuthCheck` can be applied to any admin component

## Socket Events

### Client to Server:
- `join`: Join user to their socket room
- `ban_user`: Notify server to ban a specific user
- `unban_user`: Notify server to unban a specific user

### Server to Client:
- `user_banned`: Notify user they've been banned
- `user_unbanned`: Notify user they've been unbanned

## Environment Variables

Make sure these are set in your `.env` files:

### Frontend (`.env`):
```
REACT_APP_API_URL=http://localhost:4000
REACT_APP_SOCKET_URL=http://localhost:4000
```

### Backend (`.env`):
```
FRONTEND_URL=http://localhost:3000
```

## Usage in Other Components

To use the auth checking functionality in other admin components:

```javascript
import WithAuthCheck from '../components/WithAuthCheck';

// Your component
function MyAdminComponent() {
    // ... component logic
}

export default WithAuthCheck(MyAdminComponent);
```

## Notes

1. The system works in real-time as long as both users have active socket connections
2. If a user is offline when banned, they'll be redirected when they next load any admin page
3. The periodic checking (every 30 seconds) serves as a backup mechanism
4. Super Admins have full control over all users, regular Admins can only manage customers
5. The implementation is scalable and can be extended to other real-time notifications

## Troubleshooting

If the real-time functionality isn't working:

1. Check browser console for socket connection errors
2. Verify both servers (frontend and backend) are running
3. Ensure Socket.IO is properly installed on both ends
4. Check network connectivity and CORS settings
5. Verify user IDs are being passed correctly to the socket service
