module.exports = {
    fullPhoneNumberRegex: /^\+([1-9]\d{0,2})(\d{9,12})$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    UUID_V4_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    mongoIdRegex: /^[a-f\d]{24}$/i,
    customIdRegex: /^[A-Z]{3}[0-9]{7}$/
}