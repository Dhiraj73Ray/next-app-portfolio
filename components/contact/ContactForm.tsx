"use client";

import {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";

interface Props {
  email: string;
  topics: string[];
}

type Status = "idle" | "sending" | "sent" | "mailto" | "error";
type Field = "name" | "email" | "phone" | "message" | "subject";
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
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [countdown, setCountdown] = useState(7);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`; // clipboard block ho toh mail app khol do
    }
  };

  const done = status === "sent" || status === "mailto";

  // 5-second countdown & auto reset
  useEffect(() => {
    if (!done) return;

    setCountdown(7);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          reset();
          return 7;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [done]);

  const onChange =
    (key: Field) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    };

  const reset = () => {
    setValues({ name: "", email: "", phone: "", message: "", subject: "" });
    setErrors({});
    setStatus("idle");
    setCountdown(7);
  };

  const validate = (): Errors => {
    const er: Errors = {};
    if (!values.name.trim()) er.name = "Please tell me your name.";
    if (!EMAIL_RE.test(values.email.trim()))
      er.email = "Enter a valid email so I can reply.";
    if (values.message.trim().length < 10)
      er.message = "A couple of sentences, at least.";
    return er;
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

    const cleanName = values.name.trim();
    const cleanSubject = values.subject.trim();
    const cleanPhone = values.phone.trim();

    const subject = cleanSubject
      ? `[Portfolio] ${topic} — ${cleanSubject} from ${cleanName}`
      : `[Portfolio] ${topic} from ${cleanName}`;

    if (!ENDPOINT) {
      const lines = [
        values.message.trim(),
        "",
        `Name: ${cleanName}`,
        `Email: ${values.email.trim()}`,
      ];
      if (cleanPhone) lines.push(`Phone: ${cleanPhone}`);

      const body = lines.join("\n");

      const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1` +
        `&to=${encodeURIComponent(email)}` +
        `&su=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      window.open(gmailUrl, "_blank", "noopener,noreferrer");

      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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

  return (
    <div className="relative border-2 border-ink bg-cream p-6 md:p-8 shadow-[8px_8px_0_0_#1A1A1A]">
      {/* tape */}
      <span
        aria-hidden="true"
        className="absolute -top-3 left-8 h-6 w-24 -rotate-3 bg-burnt/90"
      />

      {/* slip header */}
      <div className="flex items-center justify-between gap-4 border-b-2 border-dashed border-ink pb-3 mb-6 font-mono text-xs text-ink">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-lg sm:text-sm">To :</span>
          <a
            href={`mailto:${email}`}
            className="font-serif text-lg sm:text-sm text-ink break-all underline decoration-burnt decoration-[3px] underline-offset-[6px] hover:text-burnt transition-colors"
          >
            {email}
          </a>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 border-2 border-ink px-3 py-1.5 font-mono text-xs text-ink hover:bg-ink hover:text-cream transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Email copied to clipboard" : ""}
          </span>
        </div>
        <span className="shrink-0 text-olive">Re: {topic || "—"}</span>
      </div>

      {done ? (
        <div
          role="status"
          className="min-h-[420px] flex flex-col items-start justify-center gap-6"
        >
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
              : `Gmail opened in a new tab with your message ready. If it didn't open, reach out at ${email}.`}
          </p>

          {/* Button + Countdown label */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="font-mono text-xs uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-burnt hover:border-burnt transition-colors cursor-pointer"
            >
              Write another
            </button>
            <span className="font-mono text-xs text-ink/50">
              in {countdown}s...
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          <fieldset>
            <legend className="font-mono text-xs text-olive mb-2">
              What is this about?
            </legend>
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
                      on
                        ? "bg-ink text-cream"
                        : "bg-transparent text-ink hover:bg-ink/10"
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
            <FieldWrap
              id="cf-phone"
              label="Contact number (optional)"
              error={errors.phone}
            >
              <input
                id="cf-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={onChange("phone")}
                className={lineInput}
                placeholder="+91 98765 43210"
              />
            </FieldWrap>
            <FieldWrap
              id="cf-subject"
              label="Subject (optional)"
              error={errors.subject}
            >
              <input
                id="cf-subject"
                name="subject"
                type="text"
                autoComplete="text"
                value={values.subject}
                onChange={onChange("subject")}
                className={lineInput}
                placeholder=""
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
          <div
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            aria-hidden="true"
          >
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
              {ENDPOINT
                ? "Goes straight to my inbox."
                : "Opens your mail app with this filled in."}
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
