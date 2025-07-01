// src/app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShuttlecockIcon } from "@/components/icons/shuttlecock-icon";
import { motion, useScroll, useTransform } from "framer-motion";

// Image imports
import leagueStandings from "../../public/league-standings.png";
import teamPage from "../../public/team-page.png";
import matchSchedule from "../../public/match-schedule.png";

export default function UnauthenticatedLandingPage() {
  // useScroll hook tracks the user's scroll position
  const { scrollY } = useScroll();

  // 1. Paragraph fade-out animation
  // As scrollY goes from 0 to 50, opacity goes from 1 to 0.
  const pOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  // 2. H1 "fixed" position animation
  // To make the H1 appear fixed for 50px, we move it down by the same amount as the scroll.
  const h1Y = useTransform(scrollY, [0, 50], [0, 50], { clamp: true });

  // 3. "!" somersault animation
  // As scrollY goes from 50 to 100, rotate the "!" 360 degrees.
  const exclamationRotate = useTransform(scrollY, [50, 100], [0, 360]);

  // 4. H1 bounce effect
  // After the somersault (when scrollY passes 100), we apply a scale animation.
  const h1Scale = useTransform(scrollY, [99, 105, 120], [1, 1.05, 1]);

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-background to-secondary/50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-2xl w-full">
          <ShuttlecockIcon className="h-32 w-32 text-primary mx-auto mb-6" />

          {/* Animated H1 */}
          <motion.h1
            className="text-6xl font-bold mb-2 cursive-font text-primary"
            style={{ y: h1Y, scale: h1Scale }} // Apply the y-position and scale animations
          >
            Welcome to ShuttleUp
            <motion.span
              style={{ display: "inline-block", rotateX: exclamationRotate }} // Apply the rotation
            >
              !
            </motion.span>
          </motion.h1>

          {/* Animated Paragraph */}
          <motion.p
            className="text-lg text-muted-foreground"
            style={{ opacity: pOpacity }} // Apply the fade-out animation
          >
            The best platform to manage your badminton league.
          </motion.p>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Feature 1: League Standings */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-40"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h2 className="text-4xl font-bold mb-4">Track Your Progress</h2>
            <p className="text-lg text-muted-foreground">
              Stay updated with real-time league standings. See how your team
              stacks up against the competition with a clear and concise table.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={leagueStandings}
              alt="League Standings"
              className="rounded-lg shadow-xl"
              priority
            />
          </div>
        </motion.div>

        {/* Feature 2: Team Performance */}
        <motion.div
          className="flex flex-col md:flex-row-reverse items-center justify-between mb-40"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
            <h2 className="text-4xl font-bold mb-4">
              Analyze Your Performance
            </h2>
            <p className="text-lg text-muted-foreground">
              Dive deep into your team's performance with detailed stats, track
              your win rate, and manage your team members all in one place.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={teamPage}
              alt="Team Performance Page"
              className="rounded-lg shadow-xl"
            />
          </div>
        </motion.div>

        {/* Feature 3: Match Schedules */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h2 className="text-4xl font-bold mb-4">Never Miss a Match</h2>
            <p className="text-lg text-muted-foreground">
              Keep track of all upcoming and past matches with an easy-to-read
              schedule. See dates, times, and court information at a glance.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={matchSchedule}
              alt="Match Schedule"
              className="rounded-lg shadow-xl"
            />
          </div>
        </motion.div>
      </div>

      {/* Call to Action Section */}
      <motion.div
        className="text-center my-24 px-4"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-5xl font-bold mb-8">
          Ready for the next level of your game?
        </h2>
        <Button asChild className="py-8 px-16 text-3xl font-bold rounded-full">
          <Link href="/login">Signup to Get Started</Link>
        </Button>
      </motion.div>

      <footer className="w-full text-center p-4 mt-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShuttleUp
      </footer>
    </div>
  );
}
