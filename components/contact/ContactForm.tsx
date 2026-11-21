"use client";

import { Mail, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { SALON } from "@/lib/constants";
import { emailProblem } from "@/lib/validation";

const TOPICS = ["Booking question", "Payment or refund", "Bridal & events", "Feedback", "Something else"];

// There is no inbox behind the website (and the brief limits the database to four collections),
// so the form prepares an email to the salon in the visitor's own mail app.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const next = {
      name: name.trim().length < 2 ? "Please enter your name." : undefined,
      email: emailProblem(email) ?? undefined,
      message: message.trim().length < 10 ? "Please write at least a short message (10+ characters)." : undefined,
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    const subject = `${topic} — ${name.trim()}`;
    const body = `${message.trim()}\n\n${name.trim()}\n${email.trim()}`;
    window.location.href = `mailto:${SALON.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success("Your email app is opening with the message ready to send.");
  }

  return (
    <form onSubmit={submit} noValidate className="card space-y-5 p-6 sm:p-8">
      <div>
        <p className="eyebrow">Write to us</p>
        <h2 className="h-display mt-3 text-3xl">Send the salon a message</h2>
        <p className="mt-2 text-sm text-muted">We usually reply within a few hours during opening times.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">
            Your name
          </label>
          <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name || undefined} className="input" placeholder="Nadia Rahman" />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="label">
            Email
          </label>
          <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email || undefined} className="input" placeholder="you@example.com" />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="c-topic" className="label">
          Topic
        </label>
        <select id="c-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="input">
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="c-message" className="label flex justify-between">
          Message <span className="text-xs font-normal text-muted">{message.length}/1000</span>
        </label>
        <textarea id="c-message" rows={5} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} aria-invalid={!!errors.message || undefined} className="input" placeholder="How can we help?" />
        {errors.message && <p className="field-error">{errors.message}</p>}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-muted">
          <Mail className="size-4 text-gold" /> Opens in your email app, addressed to {SALON.email}
        </p>
        <button type="submit" className="btn btn-dark">
          <Send className="size-4" /> Send message
        </button>
      </div>
    </form>
  );
}
