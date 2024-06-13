import { getSession } from "@/libs/getSession"
import { redirect } from "next/navigation"

export default async function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  if (session) {
    redirect("/")
  }
  return (
    <>
      <h1>{children}</h1>
    </>
  )
}
