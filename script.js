// delivery-scheduling.js

// Function to determine priority hours for scheduling deliveries
function getPriorityHours() {
    const currentHour = new Date().getUTCHours();
    let priorityHours = [];

    // Define priority hours (e.g. 8AM to 10AM and 4PM to 6PM UTC)
    if (currentHour >= 8 && currentHour < 10) {
        priorityHours.push('8AM - 10AM');
    }
    if (currentHour >= 16 && currentHour < 18) {
        priorityHours.push('4PM - 6PM');
    }

    return priorityHours;
}

// Function to create a simple calendar
function createCalendar(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let calendar = '';
    calendar += `\n    <table class='calendar'>`;
    calendar += `\n        <tr>`;
    
    // Create heading for days of the week
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => calendar += `<th>${day}</th>`);
    calendar += `</tr>`;

    // Fill the calendar with blanks for dates before the first of the month
    const firstDay = new Date(year, month, 1).getDay();
    calendar += `<tr>`;
    for (let i = 0; i < firstDay; i++) {
        calendar += `<td></td>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if ((day + firstDay - 1) % 7 === 0 && day !== 1) {
            calendar += `</tr><tr>`;
        }
        calendar += `<td>${day}</td>`;
    }
    calendar += `</tr></table>`;
    return calendar;
}

// Mobile-optimized interface
function setMobileStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .calendar {
            width: 100%;
            border-collapse: collapse;
        }
        .calendar th, .calendar td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
}

// Initializing script
document.addEventListener('DOMContentLoaded', () => {
    setMobileStyles();
    console.log('Priority Hours:', getPriorityHours());
    document.body.innerHTML += createCalendar(2026, 1);  // February 2026
});
