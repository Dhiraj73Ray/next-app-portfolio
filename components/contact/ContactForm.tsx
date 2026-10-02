"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Props {
  email: string;
  topics: string[];
}

type Status = "idle" | "sending" | "sent" | "mailto" | "error";
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

/* Form backend (optional): .env.local mein daalo
   NEXT_PUBLIC_CONTACT_ENDPOINT   -> Formspree / Web3Forms / Getform URL
   NEXT_PUBLIC_CONTACT_ACCESS_KEY -> sirf Web3Forms ke liye
   Kuch set nahi hai toh "Send" user ka mail app khol deta hai (message pehle se bhara). */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
const ACCESS_KEY = process.env.NEXT_PUBLIC_CONTACT_ACCESS_KEY;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const lineInput =
  "w-full bg-transparent border-0 border-b-2 border-ink py-2 font-sans text-base text-ink placeholder:text-ink/30 focus:outline-none focus:border-burnt focus:shadow-[0_2px_0_0_#D9531E] transition-colors";

function FieldWrap({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-mono text-xs text-olive mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 font-mono text-xs text-swiss">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({ email, topics }: Props) {
  const reduce = useReducedMotion();
  const [topic, setTopic] = useState(topics[0] ?? "");
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const onChange =
    (key: Field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    };

  const validate = (): Errors => {
    const er: Errors = {};
    if (!values.name.trim()) er.name = "Please tell me your name.";
    if (!EMAIL_RE.test(values.email.trim())) er.email = "Enter a valid email so I can reply.";
    if (values.message.trim().length < 10) er.message = "A couple of sentences, at least.";
    return er;
  };

  const reset = () => {
    setValues({ name: "", email: "", message: "" });
    setErrors({});
    setStatus("idle");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot: bots ye chhupa field bharte hain, insaan nahi
    if (new FormData(e.currentTarget).get("company")) {
      setStatus("sent");
      return;
    }

    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    const subject = `[Portfolio] ${topic} from ${values.name.trim()}`;

    if (!ENDPOINT) {
      const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          topic,
          subject,
          ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const done = status === "sent" || status === "mailto";

  return (
    <div className="relative border-2 border-ink bg-cream p-6 md:p-8 shadow-[8px_8px_0_0_#1A1A1A]">
      {/* tape */}
      <span
        aria-hidden="true"
        className="absolute -top-3 left-8 h-6 w-24 -rotate-3 bg-burnt/90"
      />

      {/* slip header */}
      <div className="flex items-center justify-between gap-4 border-b-2 border-dashed border-ink pb-3 mb-6 font-mono text-xs text-ink">
        <span className="truncate">To: {email}</span>
        <span className="shrink-0 text-olive">Re: {topic || "—"}</span>
      </div>

      {done ? (
        <div role="status" className="min-h-[420px] flex flex-col items-start justify-center gap-6">
          <motion.div
            className="border-4 border-burnt px-5 py-2 font-mono text-2xl font-bold uppercase tracking-widest text-burnt"
            style={{ rotate: -8 }}
            initial={reduce ? false : { scale: 2.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
          >
            {status === "sent" ? "Sent" : "Ready"}
          </motion.div>
          <p className="max-w-sm font-sans text-base text-ink/80 leading-relaxed">
            {status === "sent"
              ? `Thanks${values.name ? `, ${values.name.split(" ")[0]}` : ""}. I'll reply to ${values.email || "you"} soon.`
              : `Your mail app should open with the message filled in. If nothing opens, email me at ${email}.`}
          </p>
          <button
            type="button"
            onClick={reset}
            className="font-mono text-xs uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-burnt hover:border-burnt transition-colors cursor-pointer"
          >
            Write another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          <fieldset>
            <legend className="font-mono text-xs text-olive mb-2">What is this about?</legend>
            <div role="radiogroup" className="flex flex-wrap gap-2">
              {topics.map((t) => {
                const on = topic === t;
                return (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setTopic(t)}
                    className={`border-2 border-ink px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                      on ? "bg-ink text-cream" : "bg-transparent text-ink hover:bg-ink/10"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <FieldWrap id="cf-name" label="Your name" error={errors.name}>
              <input
                id="cf-name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={onChange("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "cf-name-error" : undefined}
                className={lineInput}
                placeholder="Jane Doe"
              />
            </FieldWrap>
            <FieldWrap id="cf-email" label="Your email" error={errors.email}>
              <input
                id="cf-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={onChange("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "cf-email-error" : undefined}
                className={lineInput}
                placeholder="jane@company.com"
              />
            </FieldWrap>
          </div>

          <FieldWrap id="cf-message" label="Message" error={errors.message}>
            <textarea
              id="cf-message"
              name="message"
              rows={5}
              value={values.message}
              onChange={onChange("message")}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "cf-message-error" : undefined}
              placeholder="Tell me what you are building…"
              className="w-full resize-none border-2 border-ink bg-transparent px-3 py-0 font-sans text-base text-ink placeholder:text-ink/30 focus:outline-none focus:border-burnt transition-colors"
              style={{
                lineHeight: "32px",
                backgroundAttachment: "local",
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(26,26,26,0.18) 31px, rgba(26,26,26,0.18) 32px)",
              }}
            />
          </FieldWrap>

          {/* honeypot */}
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 border-2 border-ink bg-burnt px-6 py-3 font-mono text-sm uppercase text-cream transition-colors duration-200 hover:bg-ink disabled:opacity-60 disabled:cursor-wait cursor-pointer"
            >
              {status === "sending" ? "Sending…" : "Send message"}
              {status !== "sending" && <ArrowUpRight className="w-4 h-4" />}
            </button>
            <p className="font-mono text-xs text-ink/60">
              {ENDPOINT ? "Goes straight to my inbox." : "Opens your mail app with this filled in."}
            </p>
          </div>

          {status === "error" && (
            <p role="alert" className="font-mono text-xs text-swiss">
              That did not go through. Try again, or email me at {email}.
            </p>
          )}
        </form>
      )}
    </div>
  );
}