"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NeoCard } from "@/components/ui/card"
import { ArrowRight, Shield, Zap, Globe, Sparkles, Users, Wallet } from "lucide-react"
import PageTransition from "@/components/ui/page-transition"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <PageTransition className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col justify-center items-center text-center px-4 py-24 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/30 blur-[100px] rounded-full animate-pulse-glow -z-10" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full animate-float -z-10" />
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-violet-500/20 blur-[80px] rounded-full animate-float -z-10" style={{ animationDelay: '1s' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="neo-card !py-2 !px-4 inline-flex items-center gap-2 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-muted-foreground">MatchOS v1.0 is Live</span>
          <Sparkles className="w-4 h-4 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
            The Sovereign Matching Engine for{" "}
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient">
            Everything
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
        >
          Connect with trusted providers instantly. AI-orchestrated, privacy-first, and built for the decentralized future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/requests/new">
            <Button size="xl" className="w-full sm:w-auto gap-2 hover-glow">
              Start Matching <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="neo" size="xl" className="w-full sm:w-auto">
              View Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children"
        >
          {[
            { label: "Active Providers", value: "2,000+", icon: Users },
            { label: "Matches Made", value: "15k+", icon: Zap },
            { label: "Avg. Time", value: "< 2min", icon: Sparkles },
            { label: "Satisfaction", value: "99.9%", icon: Shield },
          ].map((stat, i) => (
            <NeoCard key={i} className="!p-6 text-center hover-lift">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
            </NeoCard>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent -z-10" />

        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why MatchOS?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Built with advanced technology to ensure the best matching experience.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {[
              { icon: Shield, title: "Sovereign Identity", desc: "You own your data. Privacy-first architecture with zero compromises.", color: "from-blue-500 to-cyan-500" },
              { icon: Zap, title: "AI-Powered Speed", desc: "Our matching engine finds the perfect provider in milliseconds.", color: "from-primary to-accent" },
              { icon: Globe, title: "Global Network", desc: "Connect with verified professionals from anywhere in the world.", color: "from-green-500 to-emerald-500" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <NeoCard className="h-full hover-lift group">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </NeoCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <NeoCard variant="gradient" className="text-center !p-12">
              <Wallet className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of users who trust MatchOS for their service matching needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="xl" className="w-full sm:w-auto gap-2">
                    Create Account <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="neo" size="xl" className="w-full sm:w-auto">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </NeoCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 MatchOS. Built for sovereignty.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Docs</Link>
            </div>
          </div>
        </div>
      </footer>
    </PageTransition>
  )
}
