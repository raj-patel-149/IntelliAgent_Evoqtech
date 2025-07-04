// services/notificationService.js
const Notification = require('../models/Notification');

module.exports.sendNotification =
    async ({
        userId,
        message,
        time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        date = new Date().toLocaleDateString('en-GB')
    }) => {
        try {
            const notification = await Notification.create({
                user: userId,
                message,
                read: false,
                time,
                date
            });
            // Could add real-time push notification here
            await notification.save();

            return {
                success: true,
                message: 'Notification sent successfully',
                notification
            };
        } catch (error) {
            console.error('Error sending notification:', error);
            return {
                success: false,
                message: 'Failed to send notification',
                error: error.message
            };
        }
    };