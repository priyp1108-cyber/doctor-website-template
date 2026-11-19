import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { buildWaLink, concernSubject, messages, waLink } from "@/lib/whatsapp";

const textOf = (url: string) => new URL(url).searchParams.get("text");

describe("waLink", () => {
  it("uses wa.me with digits only", () => {
    expect(waLink("+91 98765-43210", "Hi")).toBe("https://wa.me/919876543210?text=Hi");
  });

  it("URL-encodes spaces, punctuation, & and ?", () => {
    const url = waLink("919876543210", "Hello, eczema & psoriasis? 100%");
    expect(url).toContain("text=Hello%2C%20eczema%20%26%20psoriasis%3F%20100%25");
    expect(textOf(url)).toBe("Hello, eczema & psoriasis? 100%");
  });

  it("is Unicode-safe for Odia, Hindi and ₹", () => {
    const msg = "ନମସ୍କାର, मुझे डॉक्टर से मिलना है — ₹500";
    const url = waLink("919876543210", msg);
    expect(url).not.toMatch(/[^\x00-\x7F]/); // fully ASCII on the wire
    expect(textOf(url)).toBe(msg);
  });

  it("buildWaLink targets the clinic number", () => {
    expect(buildWaLink("Hi")).toBe(`https://wa.me/${site.clinic.whatsapp.replace(/\D/g, "")}?text=Hi`);
  });
});

describe("messages", () => {
  it("lower-cases the concern label", () => {
    expect(messages.concern({ slug: "hair-fall", label: "Hair fall" })).toBe(
      "Hello, I would like to see Dr. Panda about hair fall.",
    );
  });

  it('says "a skin concern" for other', () => {
    expect(concernSubject({ slug: "other", label: "Something else" })).toBe("a skin concern");
  });

  it("builds the request-form message", () => {
    expect(messages.request("Asha", "+919876543210", "acne")).toBe(
      "Hello, I am Asha (+919876543210). I would like an appointment with Dr. Panda about acne.",
    );
  });
});
