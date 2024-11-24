import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center flex-col gap-y-2 bg-secondary-foreground items-center h-screen">
      <h1 className="text-7xl text-primary font-semibold">Generate Menu</h1>
      <Link href={"/business"}>
        <Button className="font-semibold">Generate Now</Button>
      </Link>
    </div>
  );
}
