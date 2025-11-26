"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe, CheckCircle, Star } from "lucide-react"
import PageTransition from "@/components/ui/page-transition"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <PageTransition className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col justify-center items-center text-center px-4 py-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-500/10 blur-[100px] rounded-full -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/20 mb-8 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-muted-foreground">MatchOS v1.0 is Live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 mb-6"
        >
          The Sovereign Matching Engine for <span className="text-primary">Everything</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
        >
          Connect with trusted providers instantly. AI-orchestrated, privacy-first, and built for the decentralized future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/requests/new">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              Start Matching <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-lg backdrop-blur-sm bg-background/50">
              View Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center"
        >
          {[
            { label: "Active Providers", value: "2,000+" },
            { label: "Matches Made", value: "15k+" },
            { label: "Avg. Time", value: "< 2min" },
            { label: "Satisfaction", value: "99.9%" },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-secondary/20 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why MatchOS?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built with advanced technology to ensure the best matching experience.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Sovereign Identity", desc: "You own your data. Privacy-first architecture with zero compromises." },
              { icon: Zap, title: "AI-Powered Speed", desc: "Our matching engine finds the perfect provider in milliseconds." },
              { icon: Globe, title: "Global Network", desc: "Connect with verified professionals from anywhere in the world." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 rounded-2xl bg-background/40 backdrop-blur-md border border-primary/10 hover:border-primary/30 transition-all hover:bg-background/60 group"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
