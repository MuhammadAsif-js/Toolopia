export default function ContactPage(){
  return (
    <div className="container py-16 space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>
          <span className="font-semibold text-primary">We’d love to hear from you!</span>
        </p>
        <p>
          Whether you have questions, feedback, or suggestions, feel free to reach out.
        </p>
        <p>
          <span className="font-semibold">📩 Email:</span>{' '}
          <a
            href="mailto:toolopiahelp@gmail.com"
            className="text-primary hover:underline"
          >
            toolopiahelp@gmail.com
          </a>
        </p>
        <p>
          Your ideas help us improve Toolopia every day, and we’re always excited to hear from our community.
        </p>
        <p>
          We’ll do our best to get back to you as soon as possible.
        </p>
        <p>
          <span className="font-semibold">Thank you for being a part of Toolopia! 🙌</span>
        </p>
      </div>
    </div>
  );
}
