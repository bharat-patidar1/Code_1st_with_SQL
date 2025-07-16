export default function getIndianCurrentTime() {
  // Get current time in Indian timezone
  const now = new Date();
  
  // Format with proper padding and valid hours (00-23)
  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  
  // Use Intl.DateTimeFormat for reliable formatting
  const formatter = new Intl.DateTimeFormat('en-IN', options);
  const parts = formatter.formatToParts(now);
  
  // Extract components safely
  const { year, month, day, hour, minute, second } = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );
  
  // Fix 24-hour overflow (24 becomes 00)
  const validHour = hour === '24' ? '00' : hour;
  
  // Return MySQL-compatible format
  return `${year}-${month}-${day} ${validHour}:${minute}:${second}`;
}