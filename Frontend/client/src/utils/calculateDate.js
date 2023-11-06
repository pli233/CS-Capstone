function timeSince(dateString) {
  const now = new Date();
  const date = new Date(dateString);

  // Get the difference in milliseconds
  const diffMs = now - date;

  // Convert time difference to various units
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.round(diffDays / 30); // Assuming an average of 30 days per month
  const diffYears = Math.round(diffDays / 365); // Rough estimation for year difference

  // Return time difference in the desired format
  if (diffYears > 0) {
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  } else if (diffDays >= 1) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 12 && diffHours >= 1) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return 'today';
  }
}

export default timeSince;