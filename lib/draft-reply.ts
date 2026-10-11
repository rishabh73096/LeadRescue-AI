import type { Language, Lead, WorkspaceSettings } from "@/types/lead";

// Template-based draft used until the AI endpoint is connected.
// The real endpoint should take the same inputs and return the same string.
export function draftReply(lead: Lead, language: Language, settings: WorkspaceSettings): string {
  const first = lead.name.split(" ")[0];
  const biz = settings.businessName || "our team";
  const service = lead.service || "your enquiry";
  const price = settings.services.find((s) => lead.service && s.name.toLowerCase().includes(lead.service.toLowerCase().split(",")[0].trim()))?.price ?? settings.services[0]?.price;
  const sign = settings.signature || biz;

  if (language === "hi") {
    const lines = [`नमस्ते ${first} जी,`, `${service} के बारे में पूछने के लिए धन्यवाद। ${biz} में हम इसमें आपकी मदद कर सकते हैं।`];
    if (price) lines.push(`इसकी सामान्य कीमत ${price} के बीच रहती है, अंतिम कीमत जगह देखकर बताई जाएगी।`);
    if (lead.status === "quote_sent") lines.push("हमने आपको जो कोटेशन भेजा था, क्या आपने उसे देख लिया? कोई सवाल हो तो बताइए।");
    else lines.push("आपके लिए कौन सा दिन और समय ठीक रहेगा?");
    lines.push(`धन्यवाद,\n${sign}`);
    return lines.join("\n\n");
  }

  const lines = [`Hi ${first},`, `Thanks for reaching out about ${service}. We'd be happy to help.`];
  if (price) lines.push(`Typical pricing for this is ${price}; we'll confirm the exact amount after understanding the space.`);
  if (lead.status === "quote_sent") lines.push("Just checking in on the quote we sent. Happy to answer any questions or adjust it.");
  else lines.push("What day and time would suit you for a visit or call?");
  lines.push(`Regards,\n${sign}`);
  return lines.join("\n\n");
}
