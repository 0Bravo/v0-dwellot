"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MessageCircle, ArrowRight } from "lucide-react"

const WHATSAPP_URL = "https://wa.me/233201578429"

export default function BottomCTA() {
  return (
    <section className="bg-gradient-to-br from-[#0f766e] via-[#14b8a6] to-[#0d9488] py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-balance mb-4">
          Ready to Find Your Home in Ghana?
        </h2>
        <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Join over 1,200 buyers who found their dream home with Dwellot. Our team is ready to help
          you every step of the way.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/properties"
            className="flex items-center gap-2 bg-white text-[#14b8a6] hover:bg-gray-50 font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm shadow-lg"
          >
            Browse Properties <ArrowRight size={16} />
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  )
}
