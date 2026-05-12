export function getFitClass(fitLevel) {
  switch (fitLevel) {
    case "high":
      return "fit-high";
    case "moderate":
      return "fit-moderate";
    case "low":
      return "fit-low";
    default:
      return "";
  }
}