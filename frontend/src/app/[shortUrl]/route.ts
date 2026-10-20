import { redirect } from "next/navigation";

// ক্যাশ বন্ধ রাখা, যাতে প্রতিটি ক্লিকেই ব্যাকএন্ডে clickCount বৃদ্ধি পায়
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortUrl: string }> },
) {
  const { shortUrl } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${shortUrl}`,
    {
      redirect: "manual",
      cache: "no-store",
    },
  );

  const location = res.headers.get("location");
  if (location) {
    redirect(location);
  }

  redirect("/");
}
