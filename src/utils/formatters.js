export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount || amount === 'N/A') return 'Price not available';
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return timestamp;
  }
};

export const extractLinks = (text) => {
  // More precise regex to handle URLs with proper boundaries
  // Look for URLs that might be followed by parentheses or other punctuation
  const urlRegex = /(https?:\/\/[^\s\)\]\}\.,!?;:]+)(?:[)\]}.,!?;:]*)/g;
  const matches = [];
  let match;
  
  console.log('extractLinks input:', text);
  
  // Use exec to get capture groups and handle punctuation separately
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[1]; // The actual URL without trailing punctuation
    console.log('Regex match:', match[0], 'URL:', url);
    matches.push(url);
  }
  
  console.log('Final extracted links:', matches);
  return matches;
};

export const formatPropertyType = (type) => {
  if (!type || type === 'N/A') return 'Property type not specified';
  
  const typeMap = {
    'residential': 'Residential',
    'commercial': 'Commercial',
    'industrial': 'Industrial',
    'land': 'Land',
    'mixed': 'Mixed Use',
  };
  
  return typeMap[type.toLowerCase()] || type;
};

export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
