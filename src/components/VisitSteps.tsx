import { Reveal } from "./Reveal";

const steps = [
  {
    title: "Message the clinic",
    body: "Pick a time on WhatsApp. You get the slot and the address back.",
  },
  {
    title: "See the doctor",
    body: "Examination, diagnosis, and a plan with costs explained up front.",
  },
  {
    title: "Follow up easily",
    body: "[CONFIRM] Review visit or a WhatsApp photo check-in, as advised.",
  },
];

export function VisitSteps() {
  return (
    <section className="section-y" aria-labelledby="steps-title">
      <div className="wrap grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <Reveal as="h2" id="steps-title" className="text-h2 text-ink md:sticky md:top-[120px] md:self-start">
          Your visit, <em>in three steps.</em>
        </Reveal>

        <ol className="relative">
          <Reveal
            variant="line"
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-[23px] w-[2px] bg-brand"
          />
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} index={i + 1} className="relative flex gap-7 pb-12 last:pb-0">
              <span
                aria-hidden="true"
                className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-accent font-serif text-[24px] text-ink"
              >
                {i + 1}
              </span>
              <div className="pt-1.5">
                <h3 className="text-h3 text-ink">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="text-body mt-3 max-w-[44ch] text-ink-soft">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
