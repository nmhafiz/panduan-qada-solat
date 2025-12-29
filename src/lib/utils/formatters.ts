
export const formatPhone = (phone: string): string => {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');

    // Handle empty case
    if (!cleaned) return '';

    // If starts with 0 (e.g., 0123456789), replace with 60
    if (cleaned.startsWith('0')) {
        cleaned = '6' + cleaned;
    }

    // If doesn't start with 60 (e.g., 123456789), add 60
    if (!cleaned.startsWith('60')) {
        cleaned = '60' + cleaned;
    }

    // Malaysia numbers are usually 10-11 digits (excluding country code?).
    // Standard format: 60123456789 (11 digits) or 6011... (12 digits)
    // Just ensure it starts with 60.
    return cleaned;
};

export const formatName = (name: string): string => {
    // Title Case logic
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const formatEmail = (email: string): string => {
    let formatted = email.toLowerCase().trim();

    // Common typo fixes
    const domains: { [key: string]: string } = {
        'gmil.com': 'gmail.com',
        'gmal.com': 'gmail.com',
        'gnail.com': 'gmail.com',
        'yaho.com': 'yahoo.com',
        'hotmai.com': 'hotmail.com'
    };

    const parts = formatted.split('@');
    if (parts.length === 2) {
        const domain = parts[1];
        if (domains[domain]) {
            formatted = `${parts[0]}@${domains[domain]}`;
        }
    }

    return formatted;
};
