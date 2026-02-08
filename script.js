class DeliveryScheduler {
    constructor() {
        this.schedule = this.loadSchedule();
    }

    loadSchedule() {
        const storedSchedule = localStorage.getItem('deliverySchedule');
        return storedSchedule ? JSON.parse(storedSchedule) : [];
    }

    saveSchedule() {
        localStorage.setItem('deliverySchedule', JSON.stringify(this.schedule));
    }

    addDelivery(time, location) {
        if (this.validateConflict(time, location)) {
            console.error('Conflict detected: Unable to schedule this delivery time.');
            return false;
        }
        
        this.schedule.push({ time, location });
        this.saveSchedule();
        return true;
    }

    validateConflict(time, location) {
        // Check if the new delivery time conflicts with existing deliveries
        return this.schedule.some(delivery => delivery.time === time && delivery.location === location);
    }

    getPriorityTimes(day) {
        const priorityTimes = {
            'Monday': ['08:00', '12:00', '16:00'], // Example times for Metro Buenavista
            'Tuesday': ['10:00', '14:00'],          // Example times for Metro Rosario
            'Wednesday': ['09:00', '13:00'],
            'Thursday': ['11:00', '15:00'],
            'Friday': ['10:30', '16:30'],
        };
        return priorityTimes[day] || [];
    }

    groupDeliveries() {
        // Logic for intelligently grouping deliveries
        const grouped = {};
        this.schedule.forEach(delivery => {
            if (!grouped[delivery.time]) {
                grouped[delivery.time] = [];
            }
            grouped[delivery.time].push(delivery.location);
        });
        return grouped;
    }
}

// Export for use in HTML
// Scheduler instance will be created in index.html