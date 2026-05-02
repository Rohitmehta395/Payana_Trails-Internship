const validateHeader = (data) => {
  const errors = [];

  const requiredString = (val, field) => {
    if (!val || typeof val !== "string" || val.trim() === "") {
      errors.push(`${field} is required and cannot be empty.`);
    }
  };

  // siteName is now optional to allow logo-only headers
  if (data.siteName !== undefined && data.siteName !== "") {
    // optional check
  }

  if (data.mobileNumber !== undefined) {
    requiredString(data.mobileNumber, "mobileNumber");
  }

  if (data.navLabels) {
    const { home, journey, payanaWay, stories, connect } = data.navLabels;
    if (home !== undefined)      requiredString(home,      "navLabels.home");
    if (journey !== undefined)   requiredString(journey,   "navLabels.journey");
    if (payanaWay !== undefined) requiredString(payanaWay, "navLabels.payanaWay");
    if (stories !== undefined)   requiredString(stories,   "navLabels.stories");
    if (connect !== undefined)   requiredString(connect,   "navLabels.connect");
  }

  return { isValid: errors.length === 0, errors };
};

module.exports = { validateHeader };
