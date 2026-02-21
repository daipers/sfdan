import Link from 'next/link';

export const metadata = {
  title: 'Scoring Methodology - Procedural Compliance Score',
  description: 'Documentation of the procedural compliance scoring methodology for IIJA infrastructure projects',
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Scoring Methodology</h1>
          <p className="text-xl text-gray-600">
            Procedural Compliance Scoring for IIJA Infrastructure Projects
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          {/* Overview */}
          <section className="mb-8">
            <h2>Overview</h2>
            <p>
              The Procedural Compliance Score evaluates federal infrastructure awards on their 
              likelihood of following required federal procurement and oversight procedures. 
              This is not a measure of project quality or success—rather, it indicates how closely 
              the award follows processes designed to ensure accountability, competition, and 
              public benefit.
            </p>
            <p>
              Each award receives a score from 0-100 based on three weighted components:
            </p>
              <ul>
                <li><strong>Environmental Review (40%)</strong> — NEPA timeline compliance</li>
                <li><strong>Competitive Bidding (35%)</strong> — Competition requirements under 2 CFR 200</li>
                <li><strong>Modification Authorization (25%)</strong> — Change order approval process</li>
              </ul>
          </section>

          {/* Score Interpretation */}
          <section className="mb-8">
            <h2>Score Interpretation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-800 mb-2">80-100</div>
                <div className="font-semibold text-green-700 mb-1">High Compliance</div>
                <p className="text-sm text-green-600">
                  Award exhibits strong indicators of following federal procedural requirements.
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-800 mb-2">60-79</div>
                <div className="font-semibold text-yellow-700 mb-1">Medium Compliance</div>
                <p className="text-sm text-yellow-600">
                  Award has standard compliance indicators. Some procedural gaps may exist.
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-800 mb-2">0-59</div>
                <div className="font-semibold text-red-700 mb-1">Low Compliance</div>
                <p className="text-sm text-red-600">
                  Award shows limited competitive or oversight indicators.
                </p>
              </div>
            </div>
          </section>

          {/* Scoring Components */}
          <section className="mb-8">
            <h2>Scoring Components</h2>
            
            <div className="mb-6">
              <h3>Environmental Review (40% weight)</h3>
              <p>
                This component evaluates whether the award is likely subject to the National 
                Environmental Policy Act (NEPA) review process. NEPA requires federal agencies 
                to assess environmental impacts before approving major infrastructure projects.
              </p>
              <h4>Indicators:</h4>
              <ul>
                <li>Project description contains infrastructure keywords (highway, bridge, water, energy, etc.)</li>
                <li>Awarding agency is a traditional infrastructure agency (DOT, EPA, DOE, HUD)</li>
                <li>Assistance type indicates construction or infrastructure development</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Note:</strong> A higher score indicates the project is more likely to require 
                and complete environmental review—not that it has already done so.
              </p>
            </div>

            <div className="mb-6">
              <h3>Competitive Bidding (35% weight)</h3>
              <p>
                Federal regulations require competitive processes for most grants and contracts 
                to ensure best value for taxpayers. This component evaluates the competitive 
                nature of the award.
              </p>
              <h4>Indicators:</h4>
              <ul>
                <li><strong>Project Grant (Type B)</strong> — Competitive solicitation process</li>
                <li><strong>Formula Grant (Type A)</strong> — Distributed by formula, less competitive</li>
                <li><strong>Cooperative Agreement (Type C)</strong> — Some competitive elements</li>
                <li>Recipient type (state/local governments often receive formula grants)</li>
              </ul>
              <h4>Regulatory Basis:</h4>
              <ul>
                <li>2 CFR 200.319 — Competition requirements</li>
                <li>2 CFR 200.400-400 — Post-award policies</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3>Modification Authorization (25% weight)</h3>
              <p>
                Proper period of performance and oversight is required for federal awards. 
                This component evaluates whether the award has defined oversight parameters.
              </p>
              <h4>Indicators:</h4>
              <ul>
                <li>Defined start and end dates</li>
                <li>Reasonable duration (infrastructure projects typically 1-6 years)</li>
                <li>Clear period of performance</li>
              </ul>
              <h4>Regulatory Basis:</h4>
              <ul>
                <li>2 CFR 200.309 — Period of performance</li>
                <li>2 CFR 200.403-405 — Allowable costs and cost principles</li>
              </ul>
            </div>
          </section>

          {/* Regulatory Citations */}
          <section className="mb-8">
            <h2>Regulatory Framework</h2>
            <p>
              The scoring methodology is grounded in the following federal regulations and laws:
            </p>

            <div className="bg-gray-50 rounded-lg p-6 my-4">
              <h3 className="font-bold mb-2">2 CFR Part 200</h3>
              <p className="mb-2">
                <strong>Uniform Administrative Requirements, Cost Principles, and Audit Requirements for Federal Awards</strong>
              </p>
              <ul className="text-sm space-y-1">
                <li>• Subpart D — Post Federal Award Requirements (200.300-346)</li>
                <li>• §200.309 — Period of Performance</li>
                <li>• §200.319 — Competition</li>
                <li>• §200.329 — Real Property Acquisition and Relocation</li>
                <li>• §200.400 — Post Federal Award Requirements (General)</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                The 2024 revisions became effective October 1, 2024.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 my-4">
              <h3 className="font-bold mb-2">Build America Buy America Act (BABA)</h3>
              <p className="mb-2">
                <strong>IIJA §70901-70952</strong>
              </p>
              <ul className="text-sm space-y-1">
                <li>• Domestic content preference for infrastructure projects</li>
                <li>• Applies to iron, steel, manufactured products, construction materials</li>
                <li>• All manufacturing processes must occur in the United States</li>
                <li>• Effective for funds obligated after May 14, 2022</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 my-4">
              <h3 className="font-bold mb-2">Davis-Bacon Act</h3>
              <p className="mb-2">
                <strong>40 U.S.C. §§3141-3148</strong>
              </p>
              <ul className="text-sm space-y-1">
                <li>• Prevailing wage requirements for construction</li>
                <li>• Applies to contracts over $2,000</li>
                <li>• Weekly payment requirements, wage determinations</li>
                <li>• Covers laborers and mechanics on &quot;site of work&quot;</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 my-4">
              <h3 className="font-bold mb-2">National Environmental Policy Act (NEPA)</h3>
              <p className="mb-2">
                <strong>42 U.S.C. §4321 et seq.</strong>
              </p>
              <ul className="text-sm space-y-1">
                <li>• Requires environmental impact assessment for major federal actions</li>
                <li>• Applies to grants, loans, permits, and other federal approvals</li>
                <li>• Three levels: Categorical Exclusion, Environmental Assessment, EIS</li>
                <li>• Scoping and public comment requirements</li>
              </ul>
            </div>
          </section>

          {/* Limitations */}
          <section className="mb-8">
            <h2>Limitations</h2>
            <p>
              This scoring system has important limitations that users should understand:
            </p>
            <ul>
              <li>
                <strong>Data Availability:</strong> Scores are based on publicly available data 
                from USASpending.gov. Not all procedural compliance indicators are captured 
                in this data.
              </li>
              <li>
                <strong>Not Legal Compliance:</strong> A low score does not indicate a violation 
                of law—it indicates limited competitive or oversight indicators in the available data.
              </li>
              <li>
                <strong>No Project Quality Assessment:</strong> The score does not evaluate whether 
                a project was completed successfully, efficiently, or in the public interest.
              </li>
              <li>
                <strong>Dynamic Data:</strong> Award data is updated regularly. Scores may change 
                as new information becomes available.
              </li>
              <li>
                <strong>Context Matters:</strong> Some awards legitimately score lower due to 
                emergency circumstances, tribal sovereignty, or other valid reasons.
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2>Questions or Concerns?</h2>
            <p>
              If you have questions about the methodology or notice data issues, please contact us. 
              This is an independent, non-governmental analysis tool intended to help watchdog 
              audiences understand federal infrastructure spending.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <strong>Disclaimer:</strong> This tool provides an independent analysis of procedural 
              compliance indicators based on publicly available federal data. It does not represent 
              an official government assessment and should not be used for legal or regulatory purposes.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
