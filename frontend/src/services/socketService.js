import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    connect(userId) {
        if (!this.socket && userId) {
            this.socket = io(process.env.REACT_APP_API_URL, {
                transports: ['websocket'],
                query: { userId }
            });

            this.socket.on('connect', () => {
                console.log('Socket connected');
                this.isConnected = true;
                // Join the user to their specific room
                this.socket.emit('join', userId);
            });

            this.socket.on('disconnect', () => {
                console.log('Socket disconnected');
                this.isConnected = false;
            });

            this.socket.on('user_banned', (data) => {
                console.log('User banned notification received:', data);
                this.handleUserBanned(data);
            });

            this.socket.on('user_unbanned', (data) => {
                console.log('User unbanned notification received:', data);
                this.handleUserUnbanned(data);
            });

            this.socket.on('role_changed_to_customer', (data) => {
                console.log('Role changed to customer notification received:', data);
                this.handleRoleChangedToCustomer(data);
            });
        }
    }

    handleUserBanned(data) {
        // Clear both admin and regular user session data
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        
        // Show alert and redirect
        alert('Your account has been banned by an administrator. You will be redirected to the homepage.');
        
        // Force redirect to homepage
        window.location.href = '/';
    }

    handleUserUnbanned(data) {
        // You can show a notification that the user has been unbanned
        console.log('Your account has been unbanned');
        // Optionally show a notification instead of alert
        // alert('Your account has been unbanned by an administrator.');
    }

    handleRoleChangedToCustomer(data) {
        // Clear both admin and regular user session data
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        
        // Show alert and redirect
        alert('Your role has been changed to Customer. You will be redirected to the homepage.');
        
        // Force redirect to homepage
        window.location.href = '/';
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Method to emit ban event to other users
    emitUserBanned(userId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('ban_user', { userId });
        }
    }

    emitUserUnbanned(userId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('unban_user', { userId });
        }
    }

    // Method to emit role change to customer event
    emitRoleChangedToCustomer(userId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('role_changed_to_customer', { userId });
        }
    }

    // Method to check if socket is connected
    isSocketConnected() {
        return this.isConnected;
    }
}

const socketService = new SocketService();
export default socketService;
