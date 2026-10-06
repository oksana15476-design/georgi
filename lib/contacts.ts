// Add only verified business contacts. Public links are safe to ship to browsers.
export const contacts = {
 phone: '+995557125497',
 phoneLabel: '+995 557 125 497',
 telegram: 'https://t.me/zheniazikinzik',
 whatsapp: 'https://wa.me/995557125497',
 // Cal.com / Calendly link for booking the free audit; the booking button appears once it is set.
 booking: process.env.NEXT_PUBLIC_BOOKING_URL || 'https://cal.com/praxenai/audit',
};
