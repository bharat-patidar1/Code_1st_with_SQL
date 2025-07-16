export default function calculateDurationInSeconds(clockIn, clockOut) {
    // Validate inputs
    if (!clockIn || !clockOut) {
        console.error('Missing clockIn/clockOut');
        return 0; // Fallback to 0 instead of NaN
    }

    const clockInDate = new Date(clockIn);
    const clockOutDate = new Date(clockOut);

    // Validate dates
    if (isNaN(clockInDate.getTime()) || isNaN(clockOutDate.getTime())) {
        console.error('Invalid date format:', { clockIn, clockOut });
        return 0;
    }

    const diffMs = clockOutDate - clockInDate;
    
    // Handle negative duration
    if (diffMs < 0) {
        console.error('ClockOut is before ClockIn');
        return 0;
    }
    // Convert milliseconds to seconds (rounded)
    return Math.round(diffMs / 1000); 
}