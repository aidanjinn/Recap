'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu } from "lucide-react";
import { useState } from "react";

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${geist.className} antialiased bg-background min-h-screen`}>
        <div className="flex min-h-screen">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 right-4 z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar - Mobile & Desktop */}
          <Card
            className={cn(
              "fixed inset-y-0 left-0 w-64 border-r border-border z-50 transition-transform duration-300 ease-in-out md:static md:translate-x-0",
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="p-4 space-y-4">
              <h2 className="text-lg font-semibold">News Categories</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/?category=tech">Technology</a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/?category=finance">Finance</a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/?category=world">World News</a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/?category=entertainment">Entertainment</a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/?category=sports">Sports</a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/?category=weather">Weather</a>
                </Button>
              </div>
            </div>
          </Card>
          <main className="flex-1 p-6 md:p-6 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
