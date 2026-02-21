// src/app/faq/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: 'What is the Procedural Integrity Score?',
    answer: `The Procedural Integrity Score is a metric we developed to evaluate federal infrastructure awards based on their likelihood of following required federal procurement and oversight procedures. It ranges from 0-100 and is designed to help journalists, researchers, and citizens identify awards that may warrant closer scrutiny for procedural compliance.`,
  },
  {
    question: 'How is the score calculated?',
    answer: `The score is calculated using three weighted components:

• Environmental Review (40%): Evaluates whether the project is likely subject to NEPA environmental review requirements based on the project type and awarding agency.

• Competitive Bidding (35%): Assesses the competitive nature of the award based on assistance type (formula grants vs. project grants) and recipient type.

• Modification Authorization (25%): Measures the defined period of performance and oversight parameters for the award.

Each component is scored 0-100, then weighted and combined to produce the total score.`,
  },
  {
    question: 'What do the colors mean?',
    answer: `The color coding indicates the level of procedural compliance indicators:

• Green (80-100): High compliance indicators - the award shows strong indicators of following federal procedural requirements.

• Yellow (60-79): Medium compliance indicators - the award has standard compliance indicators but some procedural gaps may exist.

• Red (0-59): Low compliance indicators - the award shows limited competitive or oversight indicators in the available data.

Note: A low score does not indicate a violation of law—it indicates limited indicators in the available data.`,
  },
  {
    question: 'Where does the data come from?',
    answer: `All data is sourced from USASpending.gov, the official U.S. government website for federal spending data. We pull data on federal awards related to the Infrastructure Investment and Jobs Act (IIJA) from the Departments of Transportation, Energy, EPA, Housing and Urban Development, and Agriculture.`,
  },
  {
    question: 'How often is the data updated?',
    answer: `We refresh our data daily from the USASpending.gov API. The "Data as of" date shown on the dashboard indicates when the data was last pulled. Note that federal agencies report data with a delay, so some awards may not appear immediately.`,
  },
  {
    question: 'Can I request a score for my project?',
    answer: `Our scoring system is automated based on publicly available data from USASpending.gov. If you have questions about a specific award's score or methodology, please contact us at info@sfdan.org. For official information about a federal award, contact the awarding agency directly.`,
  },
  {
    question: 'What does "Insufficient Data" mean?',
    answer: `When we don't have enough information from USASpending.gov to calculate a meaningful score, we display "Insufficient Data." This can happen when:
• The award doesn't have enough detail in its description
• Period of performance dates are not specified
• The assistance type is not clearly defined

This doesn't mean the award is non-compliant—it simply means we can't evaluate it with the available data.`,
  },
  {
    question: 'How can I use this for journalism?',
    answer: `The Procedural Integrity Score is designed specifically for investigative journalism. Some ways to use it:
• Identify low-scoring awards in your region for potential investigation
• Compare scores across agencies or states to find patterns
• Use the score as a starting point for FOIA requests
• Track how scores change over time as new data becomes available
• Investigate the relationship between low scores and project outcomes`,
  },
  {
    question: 'Is this an official government tool?',
    answer: `No. SFDAN is an independent, non-governmental analysis tool. It does not represent an official government assessment and should not be used for legal or regulatory purposes. Our scores are based on publicly available data and are intended to help citizens and journalists understand federal infrastructure spending.`,
  },
  {
    question: 'How can I report an issue with a score?',
    answer: `If you believe there's an error in our data or scoring, please contact us at info@sfdan.org with:
• The award ID in question
• A description of the issue
• Any supporting documentation

We review all reports and will correct errors when identified. However, remember that we rely on USASpending.gov data—if their data is incorrect, we can only reflect what's available.`,
  },
]

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {faqItems.map((item, index) => (
        <div 
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            aria-expanded={openIndex === index}
          >
            <span className="font-medium text-gray-900">{item.question}</span>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="px-6 pb-4 pt-2 text-gray-600 whitespace-pre-line">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>
        
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Common questions about our scoring methodology and data
          </p>
        </header>

        <FAQAccordion />

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="font-semibold text-blue-900 mb-2">
            Still have questions?
          </h2>
          <p className="text-blue-800">
            Contact us at{' '}
            <a href="mailto:info@sfdan.org" className="underline">
              info@sfdan.org
            </a>{' '}
            or{' '}
            <a href="mailto:press@sfdan.org" className="underline">
              press@sfdan.org
            </a>{' '}
            for media inquiries.
          </p>
        </div>
      </div>
    </main>
  )
}
