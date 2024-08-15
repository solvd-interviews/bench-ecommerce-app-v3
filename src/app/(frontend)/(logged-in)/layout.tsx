import { config } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(config);
  const headersList = headers();

  const header_url = headersList.get("x-url") || "xd";
  const splittedUrl = header_url.split("/");
  const finalUrl = splittedUrl[splittedUrl.length - 1];
  if (!session) {
    redirect(`/login?redirect=${finalUrl}`);
  }

  return children;
}
