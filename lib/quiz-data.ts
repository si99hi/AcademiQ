// ─────────────────────────────────────────────────────────────
//  lib/quiz-data.ts  —  AcademiQ MCQ Data Store
// ─────────────────────────────────────────────────────────────

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // index of correct option (0-based)
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: "Physics" | "Chemistry" | "Mathematics";
  description: string;
  duration: number; // minutes
  questions: Question[];
}

// ─── Quiz Bank ────────────────────────────────────────────────

export const quizzes: Quiz[] = [
  // ── CHEMISTRY ──────────────────────────────────────────────
  {
    id: "atomic-structure",
    title: "Atomic Structure",
    subject: "Chemistry",
    description: "Test your knowledge of atomic models, quantum numbers, electronic configuration, and subatomic particles.",
    duration: 20,
    questions: [
      {
        id: 1,
        question: "Which scientist proposed the nuclear model of the atom?",
        options: ["J.J. Thomson", "Ernest Rutherford", "Niels Bohr", "John Dalton"],
        answer: 1,
        explanation: "Rutherford proposed the nuclear model based on his gold-foil experiment (1911).",
      },
      {
        id: 2,
        question: "The maximum number of electrons that can be accommodated in the 3rd shell is:",
        options: ["8", "18", "32", "2"],
        answer: 1,
        explanation: "Using 2n², for n=3: 2×9 = 18 electrons.",
      },
      {
        id: 3,
        question: "Which quantum number describes the shape of an orbital?",
        options: ["Principal (n)", "Azimuthal (l)", "Magnetic (mₗ)", "Spin (mₛ)"],
        answer: 1,
        explanation: "The azimuthal (angular momentum) quantum number l defines the shape (s, p, d, f).",
      },
      {
        id: 4,
        question: "The number of orbitals in a d-subshell is:",
        options: ["1", "3", "5", "7"],
        answer: 2,
        explanation: "d-subshell has l=2, so magnetic quantum numbers range from -2 to +2 → 5 orbitals.",
      },
      {
        id: 5,
        question: "Bohr's model successfully explained the spectrum of which element?",
        options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
        answer: 1,
        explanation: "Bohr's model accurately explains the line spectrum of hydrogen (single-electron atom).",
      },
      {
        id: 6,
        question: "An electron's spin quantum number (mₛ) can have how many values?",
        options: ["1", "2", "3", "4"],
        answer: 1,
        explanation: "mₛ = +½ or −½, giving exactly 2 possible values.",
      },
      {
        id: 7,
        question: "The de Broglie wavelength of a particle is inversely proportional to its:",
        options: ["Velocity", "Mass", "Momentum", "Kinetic energy"],
        answer: 2,
        explanation: "λ = h/p, where p is the momentum. So λ ∝ 1/p.",
      },
      {
        id: 8,
        question: "The Pauli Exclusion Principle states that no two electrons can have the same:",
        options: ["Energy", "Spin", "Set of all four quantum numbers", "Principal quantum number"],
        answer: 2,
        explanation: "No two electrons in an atom can have an identical set of all four quantum numbers.",
      },
      {
        id: 9,
        question: "Hund's rule of maximum multiplicity relates to:",
        options: ["Filling of shells before subshells", "Half-filling orbitals before pairing", "Maximum spin quantum number", "Order of energy levels"],
        answer: 1,
        explanation: "Hund's rule: electrons occupy orbitals singly with parallel spins before pairing.",
      },
      {
        id: 10,
        question: "The energy of a photon is given by E = hν. What does ν represent?",
        options: ["Velocity of light", "Frequency of radiation", "Wavelength of radiation", "Wave number"],
        answer: 1,
        explanation: "ν (nu) is the frequency of electromagnetic radiation in the Planck equation.",
      },
    ],
  },

  // ── CHEMISTRY ──────────────────────────────────────────────
  {
    id: "chemical-bonding",
    title: "Chemical Bonding",
    subject: "Chemistry",
    description: "Explore ionic, covalent, and metallic bonds — hybridisation, VSEPR theory, and molecular geometry.",
    duration: 25,
    questions: [
      {
        id: 1,
        question: "Which type of bond is formed by the complete transfer of electrons?",
        options: ["Covalent", "Metallic", "Ionic", "Coordinate"],
        answer: 2,
        explanation: "Ionic bonds form by complete electron transfer between atoms of very different electronegativity.",
      },
      {
        id: 2,
        question: "The hybridisation of carbon in CH₄ is:",
        options: ["sp", "sp²", "sp³", "sp³d"],
        answer: 2,
        explanation: "Methane: 4 bond pairs, 0 lone pairs → sp³ hybridisation, tetrahedral geometry.",
      },
      {
        id: 3,
        question: "According to VSEPR theory, the shape of water (H₂O) is:",
        options: ["Linear", "Trigonal planar", "Tetrahedral", "Bent"],
        answer: 3,
        explanation: "H₂O has 2 bonding pairs + 2 lone pairs → bent (V-shape), ~104.5° angle.",
      },
      {
        id: 4,
        question: "A coordinate (dative) bond is formed when:",
        options: ["Both atoms share equal electrons", "One atom donates both electrons to the bond", "Electrons are completely transferred", "Electrons are delocalised"],
        answer: 1,
        explanation: "In a coordinate bond, one atom (donor) provides both electrons of the shared pair.",
      },
      {
        id: 5,
        question: "Which of the following molecules has a linear geometry?",
        options: ["H₂O", "NH₃", "CO₂", "SO₂"],
        answer: 2,
        explanation: "CO₂ is sp hybridised with no lone pairs on carbon → linear, 180°.",
      },
      {
        id: 6,
        question: "Bond order of O₂ according to Molecular Orbital Theory is:",
        options: ["1", "2", "3", "1.5"],
        answer: 1,
        explanation: "O₂ bond order = (8 bonding − 4 antibonding) / 2 = 2.",
      },
      {
        id: 7,
        question: "Which property of a bond increases as bond order increases?",
        options: ["Bond length", "Bond angle", "Bond energy", "Bond polarity"],
        answer: 2,
        explanation: "Higher bond order → shorter, stronger bond with greater bond energy.",
      },
      {
        id: 8,
        question: "Hydrogen bonding is strongest in:",
        options: ["HCl", "H₂S", "HF", "HBr"],
        answer: 2,
        explanation: "F is the most electronegative element, giving HF the strongest hydrogen bonding.",
      },
      {
        id: 9,
        question: "The hybridisation of the central atom in PCl₅ is:",
        options: ["sp²", "sp³", "sp³d", "sp³d²"],
        answer: 2,
        explanation: "PCl₅: 5 bond pairs, 0 lone pairs → sp³d, trigonal bipyramidal geometry.",
      },
      {
        id: 10,
        question: "Resonance in benzene leads to:",
        options: ["Alternating single and double bonds", "Uniform bond length between C–C bonds", "Shorter bonds at odd positions", "Isolated π-bonds"],
        answer: 1,
        explanation: "Resonance delocalises π-electrons, making all C–C bonds equal in length (~1.40 Å).",
      },
    ],
  },

  // ── PHYSICS ────────────────────────────────────────────────
  {
    id: "newtons-laws",
    title: "Newton's Laws of Motion",
    subject: "Physics",
    description: "Master the three fundamental laws of motion, inertia, momentum, and their real-world applications in JEE problems.",
    duration: 20,
    questions: [
      {
        id: 1,
        question: "Newton's First Law of Motion is also known as the Law of:",
        options: ["Momentum", "Inertia", "Acceleration", "Conservation"],
        answer: 1,
        explanation: "Newton's 1st Law defines inertia: an object at rest stays at rest unless acted on by a net force.",
      },
      {
        id: 2,
        question: "A body of mass 5 kg is acted on by a net force of 20 N. Its acceleration is:",
        options: ["4 m/s²", "100 m/s²", "0.25 m/s²", "25 m/s²"],
        answer: 0,
        explanation: "F = ma → a = F/m = 20/5 = 4 m/s².",
      },
      {
        id: 3,
        question: "Newton's Third Law states that for every action there is:",
        options: ["No reaction", "A greater reaction", "An equal and opposite reaction", "A proportional reaction"],
        answer: 2,
        explanation: "Action-reaction pairs are equal in magnitude, opposite in direction, acting on different objects.",
      },
      {
        id: 4,
        question: "The SI unit of force is:",
        options: ["Dyne", "Newton", "Joule", "Pascal"],
        answer: 1,
        explanation: "1 Newton = 1 kg·m/s², defined by F = ma.",
      },
      {
        id: 5,
        question: "Impulse is defined as:",
        options: ["Force × distance", "Force × time", "Mass × acceleration", "Mass × velocity²"],
        answer: 1,
        explanation: "Impulse J = F·Δt = Δp (change in momentum).",
      },
      {
        id: 6,
        question: "If a 3 kg object is in equilibrium, the net force on it is:",
        options: ["3 N", "9.8 N", "0 N", "29.4 N"],
        answer: 2,
        explanation: "Equilibrium means ΣF = 0, regardless of the object's mass.",
      },
      {
        id: 7,
        question: "Law of Conservation of Momentum is a consequence of:",
        options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Gravity"],
        answer: 2,
        explanation: "By Newton's 3rd law, internal forces are equal and opposite → total momentum is conserved.",
      },
      {
        id: 8,
        question: "A 10 kg object moves at 5 m/s. Its momentum is:",
        options: ["2 kg·m/s", "50 kg·m/s", "15 kg·m/s", "0.5 kg·m/s"],
        answer: 1,
        explanation: "p = mv = 10 × 5 = 50 kg·m/s.",
      },
      {
        id: 9,
        question: "Which of the following is NOT a contact force?",
        options: ["Friction", "Normal reaction", "Gravity", "Tension"],
        answer: 2,
        explanation: "Gravity is a non-contact force; it acts at a distance without physical contact.",
      },
      {
        id: 10,
        question: "A lift accelerates upward at 2 m/s². The apparent weight of a 60 kg person is: (g = 10 m/s²)",
        options: ["480 N", "720 N", "600 N", "120 N"],
        answer: 1,
        explanation: "Apparent weight = m(g + a) = 60(10 + 2) = 720 N.",
      },
    ],
  },

  // ── MATHEMATICS ────────────────────────────────────────────
  {
    id: "calculus-integration",
    title: "Calculus — Integration",
    subject: "Mathematics",
    description: "Practise definite and indefinite integrals, techniques of integration, and area under curves for JEE.",
    duration: 30,
    questions: [
      {
        id: 1,
        question: "∫ x³ dx = ?",
        options: ["3x²+ C", "x⁴/4 + C", "x⁴ + C", "4x³ + C"],
        answer: 1,
        explanation: "Using the power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Here n=3 → x⁴/4 + C.",
      },
      {
        id: 2,
        question: "∫ eˣ dx = ?",
        options: ["xeˣ + C", "eˣ/x + C", "eˣ + C", "e^(x+1) + C"],
        answer: 2,
        explanation: "The integral of eˣ is eˣ + C (exponential function is its own antiderivative).",
      },
      {
        id: 3,
        question: "∫₀¹ 2x dx = ?",
        options: ["0", "1", "2", "4"],
        answer: 1,
        explanation: "[x²]₀¹ = 1² − 0² = 1.",
      },
      {
        id: 4,
        question: "∫ sin x dx = ?",
        options: ["cos x + C", "−cos x + C", "sec x + C", "−sec x + C"],
        answer: 1,
        explanation: "Standard integral: ∫sin x dx = −cos x + C.",
      },
      {
        id: 5,
        question: "The area under the curve y = x² from x = 0 to x = 3 is:",
        options: ["3", "9", "27", "81"],
        answer: 1,
        explanation: "∫₀³ x² dx = [x³/3]₀³ = 27/3 = 9.",
      },
      {
        id: 6,
        question: "∫ 1/x dx = ?",
        options: ["x + C", "ln|x| + C", "1/x² + C", "ex + C"],
        answer: 1,
        explanation: "∫(1/x)dx = ln|x| + C, valid for x ≠ 0.",
      },
      {
        id: 7,
        question: "Integration by parts formula is:",
        options: ["∫uv dx = u∫v dx − ∫(du/dx ∫v dx)dx", "∫uv dx = uv − ∫v du", "∫uv dx = u'v'", "∫uv dx = ∫u dx · ∫v dx"],
        answer: 0,
        explanation: "IBP: ∫u dv = uv − ∫v du, equivalently ∫uv dx = u(∫v dx) − ∫(u'·∫v dx)dx.",
      },
      {
        id: 8,
        question: "∫ cos x dx = ?",
        options: ["−sin x + C", "sin x + C", "tan x + C", "sec x + C"],
        answer: 1,
        explanation: "Standard integral: ∫cos x dx = sin x + C.",
      },
      {
        id: 9,
        question: "Which method is used to evaluate ∫ √(1 − x²) dx?",
        options: ["Integration by parts", "Partial fractions", "Trigonometric substitution", "Power rule"],
        answer: 2,
        explanation: "Substitute x = sin θ → dx = cos θ dθ, simplifying the integrand.",
      },
      {
        id: 10,
        question: "∫₀^π sin x dx = ?",
        options: ["0", "1", "2", "π"],
        answer: 2,
        explanation: "[−cos x]₀^π = −cos π − (−cos 0) = −(−1) + 1 = 2.",
      },
    ],
  },
];

export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find((q) => q.id === id);
}
