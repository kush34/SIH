import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f8fafc] relative text-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
        }}
      />

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center z-10 ">
        <h1 className="text-2xl font-bold">Sevak</h1>
        <span className='border p-2 rounded '>
          <SignedOut>
          <SignInButton/>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </span>
      </header>

      {/* Hero */}
      <main className="flex flex-1 items-center z-10">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 px-6">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight">
              Manage Traffic like PRO. <br /> Save 100% .
            </h2>
            <p className="text-lg text-zinc-600">
              Save time and improve mental health.
            </p>
            <Button size="lg">
              <Clock className="mr-2 h-4 w-4" /> Save Time
            </Button>
          </div>

          <div className="flex justify-center items-center">
            <img
              className="rounded-xl"
              src="/test.png"
              alt="Dashboard mockup"
              width={800}
              height={800}
            />
          </div>
        </div>
      </main>
    </div>
  );
}