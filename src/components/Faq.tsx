import { site } from "@/content/site";
import { answeredFaqs } from "@/lib/placeholder";
import { FaqEnhancer } from "./FaqEnhancer";
import { Reveal } from "./Reveal";
import { PlusIcon } from "./icons";

export function Faq() {
  const faqs = answeredFaqs(site.faqs);
  if (faqs.length === 0) return null;
  return (
    <section className="section-y pt-0" aria-labelledby="faq-title">
      <div className="wrap grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <Reveal as="h2" id="faq-title" className="text-h2 text-ink">
          Good to know
        </Reveal>
        <div data-faq className="border-t border-ink/12">
          {faqs.map((f, i) => (
            <Reveal key={f.question} index={i}>
              <details className="group border-b border-ink/12">
                <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 py-5 text-[19px] font-semibold text-ink">
                  {f.question}
                  <span className="faq-icon grid size-10 shrink-0 place-items-center rounded-full border border-ink/15 text-brand group-open:bg-brand group-open:text-paper">
                    <PlusIcon />
                  </span>
                </summary>
                <div data-faq-body className="overflow-hidden">
                  <p className="text-body max-w-[60ch] pb-6 text-ink-soft">{f.answer}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
      <FaqEnhancer />
    </section>
  );
}
