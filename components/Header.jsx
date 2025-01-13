import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"next.svg"}
            width={200}
            height={60}
            alt="logo"
            className="h-12 w-auto object-contain"
          ></Image>
        </Link>
        <div className="flex items-center space-x-4"> 
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href={"/dashboard"}
              className="text-gray-600 flex hover:text-blue-600 items-center gap-2"
            >
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard </span>
              </Button>
            </Link>

            <Link href={"/transaction/create"}>
              <Button  className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction </span>
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: { avatarBox: "w-10 h-10" },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;
