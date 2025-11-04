import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin"); // redirect to admin page
  }, []);

  return null; // or a loading spinner while redirecting
}