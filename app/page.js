import { redirect } from "next/navigation";

// The site's front door is the public portfolio.
export default function Home() {
  redirect("/portfolio");
}
