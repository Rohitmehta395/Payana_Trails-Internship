export const validateField = (name, value) => {
  if (!value && name !== "otherDestination" && name !== "message") {
    return "This field is required";
  }
  if (name === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
    return "Please enter a valid email";
  }
  return null;
};
