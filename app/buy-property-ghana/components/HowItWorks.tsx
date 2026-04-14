"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Browse & Enquire",
    description:
      "Explore our curated listings online, filter by location, budget, and property type. Submit an enquiry in seconds.",
  },
  {
    number: "02",
    title: "Virtual Tour",
    description:
      "Our team arranges live video walkthroughs so you can experience the property in full — from anywhere in the world.",
  },
  {
    number: "03",
    title: "Secure Remotely",
    description:
      "Complete paperwork, legal checks, and payments securely online. We handle the in-country process on your behalf.",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-[#14b8a6] text-sm font-semibold uppercase tracking-widest mb-2">
            Simple Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
            How It Works
          </h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto leading-relaxed">
            Buying property in Ghana from abroad has never been easier.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-start gap-4"
            >
              <span className="text-6xl font-black text-[#14b8a6]/20 leading-none select-none">
                {step.number}
              </span>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
