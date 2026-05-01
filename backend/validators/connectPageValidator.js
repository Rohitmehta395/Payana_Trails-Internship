const validateConnectPage = (data) => {
  const errors = [];

  const requiredString = (val, field) => {
    if (!val || typeof val !== "string" || val.trim() === "") {
      errors.push(`${field} is required and cannot be empty.`);
    }
  };

  const {
    enquirySection,
    referFriendSection,
    giftJourneySection,
    faqSection,
    connectSection
  } = data;

  if (connectSection) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (connectSection.email && !emailRegex.test(connectSection.email)) {
      errors.push("connectSection.email format is invalid.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = { validateConnectPage };
