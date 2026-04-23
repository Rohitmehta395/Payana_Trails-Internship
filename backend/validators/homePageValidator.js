const validateHomePage = (data) => {
  const errors = [];

  const requiredString = (val, field) => {
    if (!val || typeof val !== "string" || val.trim() === "") {
      errors.push(`${field} is required and cannot be empty.`);
    }
  };

  const {
    heroSection,
    thePayanaWay,
    storiesAndVoices,
    newsletterSection,
    connectSection,
    referAndGiftSection,
  } = data;

  if (!heroSection) errors.push("heroSection is required.");
  else {
    requiredString(heroSection.headerTitle, "heroSection.headerTitle");
    requiredString(heroSection.subtitle, "heroSection.subtitle");
  }

  if (!thePayanaWay) errors.push("thePayanaWay is required.");
  else {
    requiredString(thePayanaWay.title, "thePayanaWay.title");
    requiredString(thePayanaWay.subtitle, "thePayanaWay.subtitle");
    requiredString(thePayanaWay.quote, "thePayanaWay.quote");
    if (!Array.isArray(thePayanaWay.highlights) || thePayanaWay.highlights.length !== 4) {
      errors.push("thePayanaWay.highlights must be an array of exactly 4 strings.");
    } else {
      thePayanaWay.highlights.forEach((h, i) => requiredString(h, `thePayanaWay.highlights[${i}]`));
    }
  }

  if (!storiesAndVoices) errors.push("storiesAndVoices is required.");
  else {
    requiredString(storiesAndVoices.title, "storiesAndVoices.title");
    requiredString(storiesAndVoices.quote, "storiesAndVoices.quote");
  }

  if (!newsletterSection) errors.push("newsletterSection is required.");
  else {
    requiredString(newsletterSection.title, "newsletterSection.title");
    requiredString(newsletterSection.subtitle, "newsletterSection.subtitle");
  }

  if (!connectSection) errors.push("connectSection is required.");
  else {
    requiredString(connectSection.quote, "connectSection.quote");
    requiredString(connectSection.title, "connectSection.title");
    requiredString(connectSection.subtitle, "connectSection.subtitle");
    requiredString(connectSection.email, "connectSection.email");
    requiredString(connectSection.number, "connectSection.number");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (connectSection.email && !emailRegex.test(connectSection.email)) {
      errors.push("connectSection.email format is invalid.");
    }
    // Basic phone validation (just check if it contains numbers and optionally +)
    if (connectSection.number && !/^\+?\d{7,15}$/.test(connectSection.number.replace(/[\s-]/g, ''))) {
      errors.push("connectSection.number format is invalid.");
    }
  }

  if (!referAndGiftSection) errors.push("referAndGiftSection is required.");
  else {
    requiredString(referAndGiftSection.mainTitleBold, "referAndGiftSection.mainTitleBold");
    requiredString(referAndGiftSection.mainTitleItalic, "referAndGiftSection.mainTitleItalic");
    requiredString(referAndGiftSection.mainSubtitle, "referAndGiftSection.mainSubtitle");

    if (!referAndGiftSection.referYourFriends) errors.push("referAndGiftSection.referYourFriends is required.");
    else {
      requiredString(referAndGiftSection.referYourFriends.title, "referAndGiftSection.referYourFriends.title");
      requiredString(referAndGiftSection.referYourFriends.subtitle, "referAndGiftSection.referYourFriends.subtitle");
    }

    if (!referAndGiftSection.giftAJourney) errors.push("referAndGiftSection.giftAJourney is required.");
    else {
      requiredString(referAndGiftSection.giftAJourney.title, "referAndGiftSection.giftAJourney.title");
      requiredString(referAndGiftSection.giftAJourney.subtitle, "referAndGiftSection.giftAJourney.subtitle");
    }
  }

  if (data.testimonials) {
    if (data.testimonials.title && typeof data.testimonials.title !== "string") {
      errors.push("testimonials.title must be a string.");
    }
    if (data.testimonials.subtitle && typeof data.testimonials.subtitle !== "string") {
      errors.push("testimonials.subtitle must be a string.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = { validateHomePage };
