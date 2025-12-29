
// Simplified Malaysia Postcode Range Mapping
// Ranges based on Pos Malaysia general allocation

export const getStateFromPostcode = (postcode: string): string | null => {
    // Ensure 5 digits
    if (!/^\d{5}$/.test(postcode)) return null;

    const code = parseInt(postcode, 10);

    // KUALA LUMPUR
    if (code >= 50000 && code <= 60000) return "Kuala Lumpur";
    // PUTRAJAYA
    if (code >= 62000 && code <= 62988) return "Putrajaya";
    // LABUAN
    if (code >= 87000 && code <= 87033) return "Labuan";

    // SELANGOR (Mixed ranges, simplified for major blocks)
    // 40xxx - 48xxx, 63xxx - 68xxx
    if ((code >= 40000 && code <= 48900) || (code >= 63000 && code <= 68900)) return "Selangor";

    // PERLIS
    if (code >= 1000 && code <= 2999) return "Perlis";

    // KEDAH
    if (code >= 5000 && code <= 9810) return "Kedah";

    // PULAU PINANG
    if (code >= 10000 && code <= 14999) return "Pulau Pinang";

    // KELANTAN
    if (code >= 15000 && code <= 18999) return "Kelantan";

    // TERENGGANU
    if (code >= 20000 && code <= 24999) return "Terengganu";

    // PAHANG
    if (code >= 25000 && code <= 28800) return "Pahang"; // Also Genting Highlands usually covered here or separate

    // PERAK
    if (code >= 30000 && code <= 36810) return "Perak";

    // NEGERI SEMBILAN
    if (code >= 70000 && code <= 73509) return "Negeri Sembilan";

    // MELAKA
    if (code >= 75000 && code <= 78309) return "Melaka";

    // JOHOR
    if (code >= 80000 && code <= 86900) return "Johor"; // Excludes Labuan 87xxx

    // SABAH
    if (code >= 88000 && code <= 91309) return "Sabah";

    // SARAWAK
    if (code >= 93000 && code <= 98859) return "Sarawak";

    return null;
};

export const getCityFromPostcode = (postcode: string): string | null => {
    if (!/^\d{5}$/.test(postcode)) return null;
    const code = parseInt(postcode, 10);

    // SIMPLE MAPPING (MVP)
    // SELANGOR
    if (code >= 43000 && code <= 43099) return "Kajang";
    if (code >= 43600 && code <= 43699) return "Bandar Baru Bangi";
    if (code >= 40000 && code <= 40999) return "Shah Alam";
    if (code >= 47000 && code <= 47830) return "Petaling Jaya";
    if (code >= 47100 && code <= 47190) return "Puchong";
    if (code >= 68000 && code <= 68100) return "Ampang";
    if (code >= 63000 && code <= 63300) return "Cyberjaya";

    // KL
    if (code >= 50000 && code <= 60000) return "Kuala Lumpur";

    // PUTRAJAYA
    if (code >= 62000 && code <= 62988) return "Putrajaya";

    // JOHOR
    if (code >= 80000 && code <= 81999) return "Johor Bahru";
    if (code >= 83000 && code <= 83999) return "Batu Pahat";

    // PENANG
    if (code >= 10000 && code <= 11999) return "Georgetown";
    if (code >= 14000 && code <= 14099) return "Bukit Mertajam";

    return null;
};
