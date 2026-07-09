import LoginForm from "./LoginForm";

// Server Component: reads the ?redirectedFrom= param the middleware sets, and
// passes it to the client form so we can send the user back where they came
// from after a successful login.
export const metadata = { title: "Admin Login" };

export default function LoginPage({ searchParams }) {
  const redirectedFrom = searchParams?.redirectedFrom || "/admin/list";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <LoginForm redirectedFrom={redirectedFrom} />
    </main>
  );
}
