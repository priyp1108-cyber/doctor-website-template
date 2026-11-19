"use client";

import { useId, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { buildWaLink, concernSubject, messages } from "@/lib/whatsapp";
import { normaliseIndianMobile } from "@/lib/phone";
import { track } from "@/lib/analytics";
import { ChatIcon, ChevronIcon } from "./icons";

type Errors = { name?: string; phone?: string };

const fieldClass =
  "mt-2 block min-h-[52px] w-full rounded-2xl border bg-white px-4 text-[17px] text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus-visible:outline-2 focus-visible:outline-brand";

export function RequestForm() {
  const id = useId();
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phoneRaw = String(data.get("phone") ?? "");
    const concernSlug = String(data.get("concern") ?? "");
    const phone = normaliseIndianMobile(phoneRaw);

    const next: Errors = {};
    if (!name) next.name = "Please enter your name.";
    if (!phone) next.phone = "Please enter a 10-digit mobile number, e.g. 98765 43210.";
    setErrors(next);
    if (next.name || next.phone) {
      const first = e.currentTarget.querySelector<HTMLElement>(next.name ? "[name=name]" : "[name=phone]");
      first?.focus();
      return;
    }

    const concern = site.concerns.find((c) => c.slug === concernSlug) ?? site.concerns[site.concerns.length - 1]!;
    track("whatsapp_click", { source: "form" });
    window.open(buildWaLink(messages.request(name, phone!, concernSubject(concern))), "_blank", "noopener");
  }

  const err = (k: keyof Errors) => (errors[k] ? `${id}-${k}-error` : undefined);

  return (
    <div className="rounded-[32px] bg-paper p-7 text-ink shadow-soft sm:p-9">
      <h3 className="text-h3">Request a time</h3>
      {/* Without JS the form still opens WhatsApp with a general message. */}
      <form
        action={`https://wa.me/${site.clinic.whatsapp}`}
        method="get"
        target="_blank"
        noValidate
        onSubmit={onSubmit}
        className="mt-6 space-y-5"
      >
        <input type="hidden" name="text" value={messages.general()} />
        <div>
          <label htmlFor={`${id}-name`} className="text-[15px] font-semibold">Your name</label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={err("name")}
            className={`${fieldClass} ${errors.name ? "border-ink" : "border-ink/15"}`}
          />
          {errors.name && <p id={err("name")} className="mt-2 text-[15px] font-semibold text-ink">⚠ {errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="text-[15px] font-semibold">Phone number</label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+91 98765 43210"
            aria-invalid={!!errors.phone}
            aria-describedby={err("phone")}
            className={`${fieldClass} ${errors.phone ? "border-ink" : "border-ink/15"}`}
          />
          {errors.phone && <p id={err("phone")} className="mt-2 text-[15px] font-semibold text-ink">⚠ {errors.phone}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-concern`} className="text-[15px] font-semibold">What is it about?</label>
          <div className="relative">
            <select
              id={`${id}-concern`}
              name="concern"
              defaultValue={site.concerns[0]!.slug}
              className={`${fieldClass} cursor-pointer appearance-none border-ink/15 pr-12`}
            >
              {site.concerns.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
            <ChevronIcon className="pointer-events-none absolute top-1/2 right-4 mt-1 -translate-y-1/2 text-ink" />
          </div>
        </div>
        <button id="visit-whatsapp" type="submit" className="btn lens lens-brand w-full">
          <ChatIcon /> Send on WhatsApp
        </button>
        <p className="text-center text-[14px] text-muted">The clinic confirms your slot by message.</p>
      </form>
    </div>
  );
}
