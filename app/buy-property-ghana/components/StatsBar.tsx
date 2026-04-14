"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "1,200+", label: "Happy Buyers" },
  { value: "15+", label: "Cities Covered" },
  { value: "100%", label: "Verified Listings" },
]

export default function StatsBar() {
  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-1"
            >
              <span className="text-3xl sm:text-4xl font-bold text-[#14b8a6]">{stat.value}</span>
              <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
