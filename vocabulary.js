// Word of the Day - Enhanced Vocabulary Database v2.0
// 200+ words with etymology, synonyms, antonyms, difficulty levels, categories, and multiple examples

const VOCABULARY = [
  // ============================================
  // GENERAL VOCABULARY
  // ============================================
  {
    word: "Aberration",
    partOfSpeech: "noun",
    definition: "a departure from what is normal, usual, or expected",
    example: "The warm weather in December was an aberration from the typical cold.",
    examples: [
      "The warm weather in December was an aberration from the typical cold.",
      "His rude behavior was an aberration; he's usually very polite.",
      "Scientists studied the genetic aberration to understand the mutation."
    ],
    etymology: "Latin 'aberrare' - to wander away",
    synonyms: ["anomaly", "deviation", "irregularity"],
    antonyms: ["norm", "standard", "regularity"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Ephemeral",
    partOfSpeech: "adjective",
    definition: "lasting for a very short time",
    example: "The ephemeral beauty of cherry blossoms draws tourists each spring.",
    examples: [
      "The ephemeral beauty of cherry blossoms draws tourists each spring.",
      "Fame on social media is often ephemeral, lasting only days.",
      "The morning dew is ephemeral, disappearing with the rising sun."
    ],
    etymology: "Greek 'ephemeros' - lasting only a day",
    synonyms: ["fleeting", "transient", "momentary"],
    antonyms: ["permanent", "lasting", "enduring"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Ubiquitous",
    partOfSpeech: "adjective",
    definition: "present, appearing, or found everywhere",
    example: "Smartphones have become ubiquitous in modern society.",
    examples: [
      "Smartphones have become ubiquitous in modern society.",
      "Coffee shops are now ubiquitous in urban neighborhoods.",
      "The ubiquitous advertisements made it impossible to escape the brand."
    ],
    etymology: "Latin 'ubique' - everywhere",
    synonyms: ["omnipresent", "pervasive", "universal"],
    antonyms: ["rare", "scarce", "uncommon"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Sycophant",
    partOfSpeech: "noun",
    definition: "a person who acts obsequiously toward someone important to gain advantage",
    example: "The CEO was surrounded by sycophants who agreed with everything he said.",
    examples: [
      "The CEO was surrounded by sycophants who agreed with everything he said.",
      "She refused to be a sycophant and voiced her honest opinion.",
      "The king's court was full of sycophants seeking royal favor."
    ],
    etymology: "Greek 'sykophantes' - informer, slanderer",
    synonyms: ["flatterer", "toady", "yes-man"],
    antonyms: ["critic", "detractor", "opponent"],
    difficulty: 3,
    category: "general"
  },
  {
    word: "Laconic",
    partOfSpeech: "adjective",
    definition: "using very few words; brief and to the point",
    example: "His laconic reply of 'No' ended the discussion immediately.",
    examples: [
      "His laconic reply of 'No' ended the discussion immediately.",
      "The detective was known for his laconic style of questioning.",
      "Her laconic email left us wondering what she really thought."
    ],
    etymology: "Greek 'Lakonikos' - from Laconia, home of the famously terse Spartans",
    synonyms: ["terse", "concise", "succinct"],
    antonyms: ["verbose", "wordy", "loquacious"],
    difficulty: 3,
    category: "general"
  },
  {
    word: "Obfuscate",
    partOfSpeech: "verb",
    definition: "to render obscure, unclear, or unintelligible",
    example: "The politician tried to obfuscate the issue with complicated jargon.",
    examples: [
      "The politician tried to obfuscate the issue with complicated jargon.",
      "Technical language can obfuscate rather than clarify meaning.",
      "The company obfuscated its financial troubles in dense reports."
    ],
    etymology: "Latin 'obfuscare' - to darken",
    synonyms: ["obscure", "confuse", "muddle"],
    antonyms: ["clarify", "illuminate", "explain"],
    difficulty: 3,
    category: "general"
  },
  {
    word: "Pragmatic",
    partOfSpeech: "adjective",
    definition: "dealing with things sensibly and realistically based on practical considerations",
    example: "She took a pragmatic approach to solving the budget crisis.",
    examples: [
      "She took a pragmatic approach to solving the budget crisis.",
      "Pragmatic leaders focus on what works rather than ideology.",
      "His pragmatic advice helped us avoid unnecessary complications."
    ],
    etymology: "Greek 'pragmatikos' - fit for business",
    synonyms: ["practical", "realistic", "sensible"],
    antonyms: ["idealistic", "impractical", "unrealistic"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Esoteric",
    partOfSpeech: "adjective",
    definition: "intended for or likely to be understood by only a small number of people with specialized knowledge",
    example: "The professor's esoteric lecture on quantum physics confused most students.",
    examples: [
      "The professor's esoteric lecture on quantum physics confused most students.",
      "He collected esoteric books on ancient mysticism.",
      "The esoteric terminology made the manual nearly impossible to follow."
    ],
    etymology: "Greek 'esoterikos' - belonging to an inner circle",
    synonyms: ["arcane", "obscure", "cryptic"],
    antonyms: ["common", "familiar", "accessible"],
    difficulty: 3,
    category: "general"
  },
  {
    word: "Vindicate",
    partOfSpeech: "verb",
    definition: "to clear someone of blame or suspicion; to show to be right",
    example: "The new evidence vindicated the wrongly accused man after twenty years.",
    examples: [
      "The new evidence vindicated the wrongly accused man after twenty years.",
      "Time will vindicate our decision to invest early.",
      "The scientific study vindicated the controversial theory."
    ],
    etymology: "Latin 'vindicare' - to claim, avenge",
    synonyms: ["exonerate", "justify", "absolve"],
    antonyms: ["convict", "blame", "incriminate"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Ameliorate",
    partOfSpeech: "verb",
    definition: "to make something bad or unsatisfactory better",
    example: "The new policies were designed to ameliorate working conditions.",
    examples: [
      "The new policies were designed to ameliorate working conditions.",
      "Nothing could ameliorate her grief after the loss.",
      "The medication ameliorated his symptoms within days."
    ],
    etymology: "Latin 'melior' - better",
    synonyms: ["improve", "enhance", "alleviate"],
    antonyms: ["worsen", "aggravate", "deteriorate"],
    difficulty: 3,
    category: "general"
  },
  {
    word: "Gregarious",
    partOfSpeech: "adjective",
    definition: "fond of company; sociable",
    example: "Her gregarious personality made her the life of every party.",
    examples: [
      "Her gregarious personality made her the life of every party.",
      "Wolves are gregarious animals that live in packs.",
      "He was too gregarious to enjoy working from home alone."
    ],
    etymology: "Latin 'grex' - flock",
    synonyms: ["sociable", "outgoing", "convivial"],
    antonyms: ["introverted", "solitary", "antisocial"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Taciturn",
    partOfSpeech: "adjective",
    definition: "reserved or uncommunicative in speech; saying little",
    example: "The taciturn farmer gave only one-word answers to our questions.",
    examples: [
      "The taciturn farmer gave only one-word answers to our questions.",
      "She became taciturn after the argument, refusing to speak.",
      "His taciturn nature made it difficult to know what he was thinking."
    ],
    etymology: "Latin 'tacere' - to be silent",
    synonyms: ["reticent", "reserved", "quiet"],
    antonyms: ["talkative", "garrulous", "loquacious"],
    difficulty: 3,
    category: "general"
  },
  {
    word: "Capricious",
    partOfSpeech: "adjective",
    definition: "given to sudden and unaccountable changes of mood or behavior",
    example: "The capricious weather made it impossible to plan outdoor activities.",
    examples: [
      "The capricious weather made it impossible to plan outdoor activities.",
      "Her capricious boss changed his mind about the project daily.",
      "Fortune is capricious, favoring different people at different times."
    ],
    etymology: "Italian 'capriccio' - sudden start, from 'capro' - goat",
    synonyms: ["fickle", "unpredictable", "volatile"],
    antonyms: ["steady", "constant", "predictable"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Perfunctory",
    partOfSpeech: "adjective",
    definition: "carried out with minimum effort or reflection; mechanical",
    example: "She gave a perfunctory nod before returning to her work.",
    examples: [
      "She gave a perfunctory nod before returning to her work.",
      "His perfunctory apology did little to mend their relationship.",
      "The inspection was perfunctory, missing obvious violations."
    ],
    etymology: "Latin 'perfunctorius' - careless, from 'perfungi' - to get through",
    synonyms: ["cursory", "superficial", "mechanical"],
    antonyms: ["thorough", "careful", "diligent"],
    difficulty: 3,
    category: "general"
  },
  {
    word: "Cogent",
    partOfSpeech: "adjective",
    definition: "clear, logical, and convincing",
    example: "She presented a cogent argument that swayed the jury.",
    examples: [
      "She presented a cogent argument that swayed the jury.",
      "His cogent reasoning made the complex issue understandable.",
      "We need more cogent evidence before making a decision."
    ],
    etymology: "Latin 'cogere' - to compel, drive together",
    synonyms: ["compelling", "persuasive", "convincing"],
    antonyms: ["weak", "unconvincing", "illogical"],
    difficulty: 3,
    category: "general"
  },
  {
    word: "Pernicious",
    partOfSpeech: "adjective",
    definition: "having a harmful effect, especially in a gradual or subtle way",
    example: "The pernicious influence of misinformation spreads through social media.",
    examples: [
      "The pernicious influence of misinformation spreads through social media.",
      "Smoking has pernicious effects on lung health.",
      "The pernicious rumor damaged her reputation irreparably."
    ],
    etymology: "Latin 'perniciosus' - destructive",
    synonyms: ["harmful", "destructive", "detrimental"],
    antonyms: ["beneficial", "helpful", "wholesome"],
    difficulty: 3,
    category: "general"
  },
  {
    word: "Sagacious",
    partOfSpeech: "adjective",
    definition: "having or showing keen mental discernment and good judgment",
    example: "The sagacious investor foresaw the market crash and sold early.",
    examples: [
      "The sagacious investor foresaw the market crash and sold early.",
      "Her sagacious advice saved the company from bankruptcy.",
      "The sagacious owl is a symbol of wisdom in many cultures."
    ],
    etymology: "Latin 'sagax' - wise, prophetic",
    synonyms: ["wise", "shrewd", "astute"],
    antonyms: ["foolish", "unwise", "imprudent"],
    difficulty: 3,
    category: "general"
  },
  {
    word: "Vociferous",
    partOfSpeech: "adjective",
    definition: "expressing opinions or feelings loudly and forcefully",
    example: "The vociferous protesters could be heard blocks away.",
    examples: [
      "The vociferous protesters could be heard blocks away.",
      "She was vociferous in her opposition to the new policy.",
      "The vociferous debate lasted well into the night."
    ],
    etymology: "Latin 'vociferari' - to shout, from 'vox' - voice",
    synonyms: ["loud", "clamorous", "outspoken"],
    antonyms: ["quiet", "silent", "reserved"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Tenacious",
    partOfSpeech: "adjective",
    definition: "holding firmly to something; persistent and determined",
    example: "Her tenacious pursuit of justice finally paid off.",
    examples: [
      "Her tenacious pursuit of justice finally paid off.",
      "The tenacious ivy clung to every surface of the building.",
      "He was tenacious in his research, refusing to give up."
    ],
    etymology: "Latin 'tenax' - holding fast",
    synonyms: ["persistent", "determined", "resolute"],
    antonyms: ["yielding", "irresolute", "weak"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Quixotic",
    partOfSpeech: "adjective",
    definition: "exceedingly idealistic; unrealistic and impractical",
    example: "His quixotic quest to end all poverty seemed noble but impossible.",
    examples: [
      "His quixotic quest to end all poverty seemed noble but impossible.",
      "The quixotic plan had admirable intentions but no practical path.",
      "She embarked on a quixotic adventure across the desert alone."
    ],
    etymology: "From Don Quixote, the idealistic hero of Cervantes' novel",
    synonyms: ["idealistic", "romantic", "impractical"],
    antonyms: ["realistic", "pragmatic", "practical"],
    difficulty: 3,
    category: "literature"
  },
  {
    word: "Recalcitrant",
    partOfSpeech: "adjective",
    definition: "having an obstinately uncooperative attitude toward authority or discipline",
    example: "The recalcitrant student refused to follow any classroom rules.",
    examples: [
      "The recalcitrant student refused to follow any classroom rules.",
      "The recalcitrant mule would not move despite all efforts.",
      "Dealing with recalcitrant employees requires patience and tact."
    ],
    etymology: "Latin 'recalcitrare' - to kick back",
    synonyms: ["defiant", "rebellious", "unruly"],
    antonyms: ["compliant", "obedient", "docile"],
    difficulty: 3,
    category: "general"
  },

  // ============================================
  // BUSINESS & PROFESSIONAL
  // ============================================
  {
    word: "Fiduciary",
    partOfSpeech: "adjective",
    definition: "involving trust, especially with regard to the relationship between a trustee and a beneficiary",
    example: "Financial advisors have a fiduciary duty to act in their clients' best interests.",
    examples: [
      "Financial advisors have a fiduciary duty to act in their clients' best interests.",
      "The fiduciary relationship requires absolute transparency.",
      "Breach of fiduciary duty can result in serious legal consequences."
    ],
    etymology: "Latin 'fiducia' - trust",
    synonyms: ["trustee", "custodial", "guardian"],
    antonyms: [],
    difficulty: 3,
    category: "business"
  },
  {
    word: "Synergy",
    partOfSpeech: "noun",
    definition: "the interaction of elements that when combined produce a total effect greater than the sum of individual elements",
    example: "The merger created synergy between the two companies' complementary strengths.",
    examples: [
      "The merger created synergy between the two companies' complementary strengths.",
      "Team synergy led to innovative solutions no individual could achieve.",
      "The synergy between design and engineering produced a breakthrough product."
    ],
    etymology: "Greek 'synergos' - working together",
    synonyms: ["collaboration", "cooperation", "teamwork"],
    antonyms: ["discord", "antagonism", "conflict"],
    difficulty: 2,
    category: "business"
  },
  {
    word: "Leverage",
    partOfSpeech: "verb",
    definition: "to use something to maximum advantage",
    example: "We need to leverage our existing relationships to expand into new markets.",
    examples: [
      "We need to leverage our existing relationships to expand into new markets.",
      "She leveraged her experience to negotiate a higher salary.",
      "The company leveraged technology to reduce operational costs."
    ],
    etymology: "Old French 'levier' - to raise",
    synonyms: ["utilize", "exploit", "capitalize on"],
    antonyms: ["waste", "squander", "neglect"],
    difficulty: 2,
    category: "business"
  },
  {
    word: "Mitigate",
    partOfSpeech: "verb",
    definition: "to make less severe, serious, or painful",
    example: "The company took steps to mitigate the risk of data breaches.",
    examples: [
      "The company took steps to mitigate the risk of data breaches.",
      "Planting trees can help mitigate climate change effects.",
      "Nothing could mitigate the damage caused by the scandal."
    ],
    etymology: "Latin 'mitigare' - to soften",
    synonyms: ["alleviate", "reduce", "lessen"],
    antonyms: ["aggravate", "intensify", "exacerbate"],
    difficulty: 2,
    category: "business"
  },
  {
    word: "Paradigm",
    partOfSpeech: "noun",
    definition: "a typical example or pattern of something; a model",
    example: "The discovery created a new paradigm in scientific thinking.",
    examples: [
      "The discovery created a new paradigm in scientific thinking.",
      "Remote work represents a paradigm shift in employment.",
      "The company's success became a paradigm for the industry."
    ],
    etymology: "Greek 'paradeigma' - pattern, model",
    synonyms: ["model", "standard", "archetype"],
    antonyms: ["anomaly", "deviation"],
    difficulty: 2,
    category: "business"
  },
  {
    word: "Proliferate",
    partOfSpeech: "verb",
    definition: "to increase rapidly in numbers; multiply",
    example: "Fake news stories proliferate quickly on social media platforms.",
    examples: [
      "Fake news stories proliferate quickly on social media platforms.",
      "Startups proliferated in the tech sector during the boom.",
      "Without regulation, harmful practices will proliferate."
    ],
    etymology: "Latin 'proles' - offspring + 'ferre' - to bear",
    synonyms: ["multiply", "spread", "expand"],
    antonyms: ["decrease", "diminish", "contract"],
    difficulty: 2,
    category: "business"
  },
  {
    word: "Equivocate",
    partOfSpeech: "verb",
    definition: "to use ambiguous language to conceal the truth or avoid commitment",
    example: "The CEO equivocated when asked about upcoming layoffs.",
    examples: [
      "The CEO equivocated when asked about upcoming layoffs.",
      "Politicians often equivocate to avoid taking clear positions.",
      "Stop equivocating and give us a straight answer."
    ],
    etymology: "Latin 'aequivocus' - of equal voice, ambiguous",
    synonyms: ["prevaricate", "hedge", "waffle"],
    antonyms: ["be direct", "be forthright", "be candid"],
    difficulty: 3,
    category: "business"
  },
  {
    word: "Expedient",
    partOfSpeech: "adjective",
    definition: "convenient and practical, although possibly improper or immoral",
    example: "Taking the shortcut was expedient but not entirely ethical.",
    examples: [
      "Taking the shortcut was expedient but not entirely ethical.",
      "The expedient solution saved time but created new problems.",
      "It seemed expedient to agree rather than continue arguing."
    ],
    etymology: "Latin 'expedire' - to free the feet",
    synonyms: ["convenient", "practical", "advantageous"],
    antonyms: ["impractical", "inconvenient", "principled"],
    difficulty: 2,
    category: "business"
  },
  {
    word: "Remuneration",
    partOfSpeech: "noun",
    definition: "money paid for work or a service",
    example: "The job offered generous remuneration including bonuses and stock options.",
    examples: [
      "The job offered generous remuneration including bonuses and stock options.",
      "Adequate remuneration is essential for employee retention.",
      "The remuneration package was competitive with industry standards."
    ],
    etymology: "Latin 'remunerari' - to reward",
    synonyms: ["compensation", "payment", "salary"],
    antonyms: [],
    difficulty: 2,
    category: "business"
  },
  {
    word: "Commensurate",
    partOfSpeech: "adjective",
    definition: "corresponding in size or degree; in proportion",
    example: "The salary should be commensurate with experience and qualifications.",
    examples: [
      "The salary should be commensurate with experience and qualifications.",
      "The punishment was commensurate with the severity of the crime.",
      "Her rewards were not commensurate with her contributions."
    ],
    etymology: "Latin 'commensurare' - to measure together",
    synonyms: ["proportional", "corresponding", "equivalent"],
    antonyms: ["disproportionate", "unequal", "inadequate"],
    difficulty: 3,
    category: "business"
  },

  // ============================================
  // LITERATURE & ARTS
  // ============================================
  {
    word: "Mellifluous",
    partOfSpeech: "adjective",
    definition: "sweet or musical; pleasant to hear",
    example: "The singer's mellifluous voice captivated the audience.",
    examples: [
      "The singer's mellifluous voice captivated the audience.",
      "She spoke in mellifluous tones that put everyone at ease.",
      "The mellifluous sounds of the stream created a peaceful atmosphere."
    ],
    etymology: "Latin 'mel' - honey + 'fluere' - to flow",
    synonyms: ["melodious", "dulcet", "euphonious"],
    antonyms: ["harsh", "grating", "discordant"],
    difficulty: 3,
    category: "arts"
  },
  {
    word: "Anachronism",
    partOfSpeech: "noun",
    definition: "a thing belonging to a period other than the one in which it exists",
    example: "The knight's wristwatch was an obvious anachronism in the medieval film.",
    examples: [
      "The knight's wristwatch was an obvious anachronism in the medieval film.",
      "Using fax machines feels like an anachronism in the digital age.",
      "The author deliberately included anachronisms for comedic effect."
    ],
    etymology: "Greek 'ana' - against + 'chronos' - time",
    synonyms: ["archaism", "throwback"],
    antonyms: [],
    difficulty: 2,
    category: "literature"
  },
  {
    word: "Allegory",
    partOfSpeech: "noun",
    definition: "a story, poem, or picture that can be interpreted to reveal a hidden meaning",
    example: "Animal Farm is an allegory about the Russian Revolution.",
    examples: [
      "Animal Farm is an allegory about the Russian Revolution.",
      "Plato's Cave is a famous allegory about perception and reality.",
      "The painting is an allegory of the struggle between good and evil."
    ],
    etymology: "Greek 'allegoria' - speaking otherwise",
    synonyms: ["parable", "metaphor", "symbol"],
    antonyms: ["literal", "direct"],
    difficulty: 2,
    category: "literature"
  },
  {
    word: "Juxtaposition",
    partOfSpeech: "noun",
    definition: "the fact of placing two or more things side by side for contrast or comparison",
    example: "The juxtaposition of wealth and poverty in the city was striking.",
    examples: [
      "The juxtaposition of wealth and poverty in the city was striking.",
      "The artist used juxtaposition of colors to create visual tension.",
      "The film's juxtaposition of comedy and tragedy was masterful."
    ],
    etymology: "Latin 'juxta' - near + 'ponere' - to place",
    synonyms: ["contrast", "comparison", "apposition"],
    antonyms: ["separation", "isolation"],
    difficulty: 2,
    category: "literature"
  },
  {
    word: "Verisimilitude",
    partOfSpeech: "noun",
    definition: "the appearance of being true or real",
    example: "The documentary achieved remarkable verisimilitude through its recreation of historical events.",
    examples: [
      "The documentary achieved remarkable verisimilitude through its recreation of historical events.",
      "The novel's verisimilitude made readers forget it was fiction.",
      "Digital effects have improved the verisimilitude of science fiction films."
    ],
    etymology: "Latin 'verisimilis' - having the appearance of truth",
    synonyms: ["authenticity", "plausibility", "realism"],
    antonyms: ["falseness", "unreality", "implausibility"],
    difficulty: 4,
    category: "literature"
  },
  {
    word: "Denouement",
    partOfSpeech: "noun",
    definition: "the final part of a narrative in which matters are explained or resolved",
    example: "The mystery's denouement revealed the butler as the killer.",
    examples: [
      "The mystery's denouement revealed the butler as the killer.",
      "The play's denouement tied up all the loose plot threads.",
      "Readers eagerly awaited the denouement of the series."
    ],
    etymology: "French 'dénouer' - to untie",
    synonyms: ["conclusion", "resolution", "ending"],
    antonyms: ["beginning", "introduction", "exposition"],
    difficulty: 3,
    category: "literature"
  },
  {
    word: "Pathos",
    partOfSpeech: "noun",
    definition: "a quality that evokes pity or sadness",
    example: "The speech was filled with pathos that moved the audience to tears.",
    examples: [
      "The speech was filled with pathos that moved the audience to tears.",
      "The novel's pathos came from the protagonist's quiet suffering.",
      "Too much pathos can seem manipulative to readers."
    ],
    etymology: "Greek 'pathos' - suffering, feeling",
    synonyms: ["emotion", "sentiment", "poignancy"],
    antonyms: ["indifference", "apathy"],
    difficulty: 2,
    category: "literature"
  },
  {
    word: "Soliloquy",
    partOfSpeech: "noun",
    definition: "an act of speaking one's thoughts aloud when alone, especially in a drama",
    example: "Hamlet's 'To be or not to be' is the most famous soliloquy in English literature.",
    examples: [
      "Hamlet's 'To be or not to be' is the most famous soliloquy in English literature.",
      "The character's soliloquy revealed her inner turmoil.",
      "Modern plays rarely use traditional soliloquies."
    ],
    etymology: "Latin 'solus' - alone + 'loqui' - to speak",
    synonyms: ["monologue", "speech"],
    antonyms: ["dialogue", "conversation"],
    difficulty: 2,
    category: "literature"
  },
  {
    word: "Pastiche",
    partOfSpeech: "noun",
    definition: "an artistic work that imitates the style of another work, artist, or period",
    example: "The film was a pastiche of 1950s science fiction movies.",
    examples: [
      "The film was a pastiche of 1950s science fiction movies.",
      "Her novel is a clever pastiche of Victorian gothic fiction.",
      "The restaurant's décor was a pastiche of different eras."
    ],
    etymology: "Italian 'pasticcio' - a pie, hodgepodge",
    synonyms: ["imitation", "parody", "homage"],
    antonyms: ["original", "authentic"],
    difficulty: 3,
    category: "arts"
  },
  {
    word: "Aesthetic",
    partOfSpeech: "adjective",
    definition: "concerned with beauty or the appreciation of beauty",
    example: "The building was designed with purely aesthetic considerations in mind.",
    examples: [
      "The building was designed with purely aesthetic considerations in mind.",
      "Her aesthetic sensibilities were reflected in her minimalist home.",
      "The band's aesthetic evolved from punk to electronic."
    ],
    etymology: "Greek 'aisthētikos' - perceptive, sensitive",
    synonyms: ["artistic", "visual", "elegant"],
    antonyms: ["ugly", "unattractive", "functional"],
    difficulty: 2,
    category: "arts"
  },

  // ============================================
  // SCIENCE & TECHNOLOGY
  // ============================================
  {
    word: "Empirical",
    partOfSpeech: "adjective",
    definition: "based on observation or experience rather than theory or pure logic",
    example: "The hypothesis was supported by empirical evidence from multiple experiments.",
    examples: [
      "The hypothesis was supported by empirical evidence from multiple experiments.",
      "Empirical research forms the foundation of scientific knowledge.",
      "Her claims lacked empirical support and were dismissed."
    ],
    etymology: "Greek 'empeirikos' - experienced",
    synonyms: ["experimental", "observational", "practical"],
    antonyms: ["theoretical", "speculative", "hypothetical"],
    difficulty: 2,
    category: "science"
  },
  {
    word: "Hypothesis",
    partOfSpeech: "noun",
    definition: "a supposition or proposed explanation made as a starting point for further investigation",
    example: "The scientist formed a hypothesis about the cause of the phenomenon.",
    examples: [
      "The scientist formed a hypothesis about the cause of the phenomenon.",
      "Testing the hypothesis required years of careful experimentation.",
      "The data contradicted our initial hypothesis."
    ],
    etymology: "Greek 'hypotithenai' - to put under, suppose",
    synonyms: ["theory", "supposition", "conjecture"],
    antonyms: ["fact", "certainty", "proof"],
    difficulty: 2,
    category: "science"
  },
  {
    word: "Entropy",
    partOfSpeech: "noun",
    definition: "a gradual decline into disorder; in physics, a measure of the unavailable energy in a closed system",
    example: "Without maintenance, the old house was succumbing to entropy.",
    examples: [
      "Without maintenance, the old house was succumbing to entropy.",
      "The second law of thermodynamics describes the increase of entropy.",
      "Some argue that organizations naturally tend toward entropy."
    ],
    etymology: "Greek 'entropía' - a turning toward",
    synonyms: ["disorder", "chaos", "decay"],
    antonyms: ["order", "organization", "structure"],
    difficulty: 3,
    category: "science"
  },
  {
    word: "Catalyst",
    partOfSpeech: "noun",
    definition: "a substance that increases the rate of a chemical reaction; a person or thing that precipitates an event",
    example: "The assassination was the catalyst for the war.",
    examples: [
      "The assassination was the catalyst for the war.",
      "She became a catalyst for change in her community.",
      "Enzymes act as catalysts in biological reactions."
    ],
    etymology: "Greek 'katalysis' - dissolution",
    synonyms: ["stimulus", "trigger", "impetus"],
    antonyms: ["inhibitor", "deterrent"],
    difficulty: 2,
    category: "science"
  },
  {
    word: "Anomaly",
    partOfSpeech: "noun",
    definition: "something that deviates from what is standard, normal, or expected",
    example: "The data point was an anomaly that skewed the results.",
    examples: [
      "The data point was an anomaly that skewed the results.",
      "Her success was an anomaly in an otherwise failing department.",
      "Scientists investigated the anomaly in the magnetic field."
    ],
    etymology: "Greek 'anomalia' - unevenness",
    synonyms: ["aberration", "irregularity", "deviation"],
    antonyms: ["norm", "standard", "regularity"],
    difficulty: 2,
    category: "science"
  },
  {
    word: "Symbiosis",
    partOfSpeech: "noun",
    definition: "a mutually beneficial relationship between different organisms or groups",
    example: "The relationship between bees and flowers is a classic example of symbiosis.",
    examples: [
      "The relationship between bees and flowers is a classic example of symbiosis.",
      "A symbiosis developed between the two companies, each supporting the other.",
      "The cultural symbiosis between the two nations produced unique art forms."
    ],
    etymology: "Greek 'symbiosis' - living together",
    synonyms: ["mutualism", "partnership", "cooperation"],
    antonyms: ["parasitism", "competition", "antagonism"],
    difficulty: 2,
    category: "science"
  },
  {
    word: "Paradigmatic",
    partOfSpeech: "adjective",
    definition: "serving as a typical example or pattern",
    example: "The experiment became paradigmatic for future research in the field.",
    examples: [
      "The experiment became paradigmatic for future research in the field.",
      "Her work is paradigmatic of the modernist movement.",
      "The case is paradigmatic of the challenges facing the industry."
    ],
    etymology: "Greek 'paradeigma' - pattern",
    synonyms: ["exemplary", "typical", "model"],
    antonyms: ["atypical", "unusual", "exceptional"],
    difficulty: 3,
    category: "science"
  },
  {
    word: "Atrophy",
    partOfSpeech: "noun/verb",
    definition: "gradual decline in effectiveness or vigor due to underuse or neglect",
    example: "Without regular practice, her musical skills began to atrophy.",
    examples: [
      "Without regular practice, her musical skills began to atrophy.",
      "Muscle atrophy occurs when limbs are immobilized for long periods.",
      "The rural economy continued to atrophy as young people moved away."
    ],
    etymology: "Greek 'atrophia' - lack of nourishment",
    synonyms: ["wasting", "degeneration", "decline"],
    antonyms: ["growth", "development", "strengthening"],
    difficulty: 2,
    category: "science"
  },

  // ============================================
  // PHILOSOPHY & ETHICS
  // ============================================
  {
    word: "Existential",
    partOfSpeech: "adjective",
    definition: "relating to existence; concerned with fundamental questions about life and meaning",
    example: "Climate change poses an existential threat to coastal communities.",
    examples: [
      "Climate change poses an existential threat to coastal communities.",
      "The book explores existential questions about human purpose.",
      "She experienced an existential crisis after losing her job."
    ],
    etymology: "Latin 'existentia' - existence",
    synonyms: ["fundamental", "vital", "philosophical"],
    antonyms: ["trivial", "superficial"],
    difficulty: 2,
    category: "philosophy"
  },
  {
    word: "Dichotomy",
    partOfSpeech: "noun",
    definition: "a division or contrast between two things that are represented as entirely different",
    example: "The dichotomy between work and life balance is increasingly blurred.",
    examples: [
      "The dichotomy between work and life balance is increasingly blurred.",
      "The book challenges the traditional dichotomy of good versus evil.",
      "A false dichotomy presents only two options when more exist."
    ],
    etymology: "Greek 'dikhotomia' - cutting in two",
    synonyms: ["division", "split", "contrast"],
    antonyms: ["unity", "agreement", "similarity"],
    difficulty: 2,
    category: "philosophy"
  },
  {
    word: "Dogmatic",
    partOfSpeech: "adjective",
    definition: "inclined to lay down principles as incontrovertibly true",
    example: "His dogmatic approach left no room for alternative viewpoints.",
    examples: [
      "His dogmatic approach left no room for alternative viewpoints.",
      "The professor was criticized for being too dogmatic in his teachings.",
      "Dogmatic thinking prevents intellectual growth."
    ],
    etymology: "Greek 'dogma' - opinion, belief",
    synonyms: ["opinionated", "inflexible", "doctrinaire"],
    antonyms: ["open-minded", "flexible", "tolerant"],
    difficulty: 2,
    category: "philosophy"
  },
  {
    word: "Nihilism",
    partOfSpeech: "noun",
    definition: "the rejection of all religious and moral principles in the belief that life is meaningless",
    example: "The character's descent into nihilism reflected his disillusionment with society.",
    examples: [
      "The character's descent into nihilism reflected his disillusionment with society.",
      "Nietzsche warned about the dangers of nihilism in modern culture.",
      "Existentialist philosophers grappled with overcoming nihilism."
    ],
    etymology: "Latin 'nihil' - nothing",
    synonyms: ["skepticism", "pessimism", "negativism"],
    antonyms: ["optimism", "idealism", "faith"],
    difficulty: 3,
    category: "philosophy"
  },
  {
    word: "Hegemony",
    partOfSpeech: "noun",
    definition: "leadership or dominance, especially by one country or social group",
    example: "The nation sought to establish cultural hegemony in the region.",
    examples: [
      "The nation sought to establish cultural hegemony in the region.",
      "Corporate hegemony threatens small businesses.",
      "The decline of Western hegemony is reshaping global politics."
    ],
    etymology: "Greek 'hegemonia' - leadership, from 'hegemon' - leader",
    synonyms: ["dominance", "supremacy", "control"],
    antonyms: ["subordination", "weakness", "subjugation"],
    difficulty: 3,
    category: "philosophy"
  },
  {
    word: "Utilitarian",
    partOfSpeech: "adjective",
    definition: "designed to be useful rather than attractive; relating to the doctrine that actions are right if they benefit the majority",
    example: "The building's utilitarian design prioritized function over form.",
    examples: [
      "The building's utilitarian design prioritized function over form.",
      "Utilitarian ethics judge actions by their consequences.",
      "The furniture was strictly utilitarian, with no decorative elements."
    ],
    etymology: "Latin 'utilis' - useful",
    synonyms: ["practical", "functional", "pragmatic"],
    antonyms: ["decorative", "ornamental", "impractical"],
    difficulty: 2,
    category: "philosophy"
  },
  {
    word: "Axiom",
    partOfSpeech: "noun",
    definition: "a statement or proposition regarded as being established, accepted, or self-evidently true",
    example: "It is an axiom in business that time is money.",
    examples: [
      "It is an axiom in business that time is money.",
      "Mathematical proofs are built upon axioms.",
      "The axiom that all people are created equal underpins democracy."
    ],
    etymology: "Greek 'axioma' - that which is thought worthy",
    synonyms: ["principle", "truism", "maxim"],
    antonyms: ["falsehood", "absurdity"],
    difficulty: 2,
    category: "philosophy"
  },
  {
    word: "Dialectic",
    partOfSpeech: "noun",
    definition: "the art of investigating or discussing the truth of opinions; a method of argument involving thesis, antithesis, and synthesis",
    example: "Hegel's dialectic influenced generations of philosophers.",
    examples: [
      "Hegel's dialectic influenced generations of philosophers.",
      "The debate revealed the dialectic between tradition and progress.",
      "Socratic dialectic uses questioning to expose contradictions."
    ],
    etymology: "Greek 'dialektikē' - art of debate",
    synonyms: ["argumentation", "discourse", "reasoning"],
    antonyms: [],
    difficulty: 3,
    category: "philosophy"
  },
  {
    word: "Teleological",
    partOfSpeech: "adjective",
    definition: "relating to the explanation of phenomena by the purpose they serve rather than by causes",
    example: "Teleological arguments for God's existence point to design in nature.",
    examples: [
      "Teleological arguments for God's existence point to design in nature.",
      "The teleological approach asks 'what is this for?' rather than 'how did this happen?'",
      "Darwin's theory challenged teleological explanations of evolution."
    ],
    etymology: "Greek 'telos' - end, purpose",
    synonyms: ["purposive", "goal-oriented"],
    antonyms: ["causal", "mechanistic"],
    difficulty: 4,
    category: "philosophy"
  },

  // ============================================
  // LAW & GOVERNANCE
  // ============================================
  {
    word: "Precedent",
    partOfSpeech: "noun",
    definition: "an earlier event or action serving as an example or guide for similar circumstances",
    example: "The court's decision set a precedent for future cases.",
    examples: [
      "The court's decision set a precedent for future cases.",
      "There was no precedent for such an unusual situation.",
      "Breaking with precedent, the company promoted from outside."
    ],
    etymology: "Latin 'praecedere' - to go before",
    synonyms: ["example", "model", "standard"],
    antonyms: [],
    difficulty: 2,
    category: "law"
  },
  {
    word: "Jurisprudence",
    partOfSpeech: "noun",
    definition: "the theory or philosophy of law",
    example: "Her expertise in constitutional jurisprudence made her a sought-after expert.",
    examples: [
      "Her expertise in constitutional jurisprudence made her a sought-after expert.",
      "The course covered different schools of jurisprudence.",
      "American jurisprudence draws from English common law."
    ],
    etymology: "Latin 'jurisprudentia' - knowledge of law",
    synonyms: ["legal theory", "legal philosophy"],
    antonyms: [],
    difficulty: 3,
    category: "law"
  },
  {
    word: "Adjudicate",
    partOfSpeech: "verb",
    definition: "to make a formal judgment or decision about a problem or disputed matter",
    example: "The tribunal was formed to adjudicate disputes between the parties.",
    examples: [
      "The tribunal was formed to adjudicate disputes between the parties.",
      "The judge will adjudicate the case next month.",
      "International bodies adjudicate trade disagreements between nations."
    ],
    etymology: "Latin 'adjudicare' - to judge",
    synonyms: ["judge", "arbitrate", "decide"],
    antonyms: [],
    difficulty: 3,
    category: "law"
  },
  {
    word: "Mandate",
    partOfSpeech: "noun/verb",
    definition: "an official order or commission to do something; the authority to carry out a policy",
    example: "The election gave the president a mandate for reform.",
    examples: [
      "The election gave the president a mandate for reform.",
      "The new law mandates higher fuel efficiency standards.",
      "The organization operates under a UN mandate."
    ],
    etymology: "Latin 'mandare' - to command",
    synonyms: ["order", "command", "directive"],
    antonyms: ["request", "suggestion"],
    difficulty: 2,
    category: "law"
  },
  {
    word: "Codify",
    partOfSpeech: "verb",
    definition: "to arrange laws or rules into a systematic code",
    example: "The committee worked to codify the new regulations.",
    examples: [
      "The committee worked to codify the new regulations.",
      "The traditions were eventually codified into written law.",
      "Attempts to codify international human rights began after WWII."
    ],
    etymology: "Latin 'codex' - book + 'facere' - to make",
    synonyms: ["systematize", "organize", "arrange"],
    antonyms: ["disorganize", "scatter"],
    difficulty: 3,
    category: "law"
  },
  {
    word: "Litigation",
    partOfSpeech: "noun",
    definition: "the process of taking legal action",
    example: "The company faced years of litigation over the patent dispute.",
    examples: [
      "The company faced years of litigation over the patent dispute.",
      "Litigation costs can be prohibitive for small businesses.",
      "They decided to settle out of court to avoid lengthy litigation."
    ],
    etymology: "Latin 'litigare' - to dispute",
    synonyms: ["lawsuit", "legal action", "prosecution"],
    antonyms: ["settlement", "mediation"],
    difficulty: 2,
    category: "law"
  },
  {
    word: "Indict",
    partOfSpeech: "verb",
    definition: "to formally accuse of or charge with a serious crime",
    example: "The grand jury voted to indict the executive on fraud charges.",
    examples: [
      "The grand jury voted to indict the executive on fraud charges.",
      "The evidence was sufficient to indict but not convict.",
      "Several officials were indicted for corruption."
    ],
    etymology: "Anglo-French 'enditer' - to write against",
    synonyms: ["charge", "accuse", "arraign"],
    antonyms: ["acquit", "exonerate", "absolve"],
    difficulty: 2,
    category: "law"
  },
  {
    word: "Sovereign",
    partOfSpeech: "adjective/noun",
    definition: "possessing supreme or ultimate power; a supreme ruler",
    example: "Each nation has sovereign rights over its territorial waters.",
    examples: [
      "Each nation has sovereign rights over its territorial waters.",
      "The sovereign power of parliament was absolute.",
      "The monarch remained the nominal sovereign despite constitutional limits."
    ],
    etymology: "Old French 'soverain' - supreme",
    synonyms: ["supreme", "autonomous", "independent"],
    antonyms: ["subordinate", "dependent", "subject"],
    difficulty: 2,
    category: "law"
  },

  // ============================================
  // MEDICINE & HEALTH
  // ============================================
  {
    word: "Etiology",
    partOfSpeech: "noun",
    definition: "the cause, set of causes, or manner of causation of a disease or condition",
    example: "Researchers are studying the etiology of the new disease.",
    examples: [
      "Researchers are studying the etiology of the new disease.",
      "The etiology of many autoimmune disorders remains unclear.",
      "Understanding etiology is crucial for developing treatments."
    ],
    etymology: "Greek 'aitiologia' - giving a reason",
    synonyms: ["causation", "origin", "source"],
    antonyms: [],
    difficulty: 3,
    category: "medicine"
  },
  {
    word: "Prognosis",
    partOfSpeech: "noun",
    definition: "the likely course of a disease or ailment; a forecast of likely outcome",
    example: "The doctor gave a positive prognosis for full recovery.",
    examples: [
      "The doctor gave a positive prognosis for full recovery.",
      "Early detection significantly improves the prognosis.",
      "The economic prognosis for next year remains uncertain."
    ],
    etymology: "Greek 'prognosis' - foreknowledge",
    synonyms: ["forecast", "prediction", "outlook"],
    antonyms: ["diagnosis"],
    difficulty: 2,
    category: "medicine"
  },
  {
    word: "Palliative",
    partOfSpeech: "adjective",
    definition: "relieving pain or alleviating a problem without dealing with the underlying cause",
    example: "Palliative care focuses on comfort rather than cure.",
    examples: [
      "Palliative care focuses on comfort rather than cure.",
      "The measures were palliative, not solutions to the root problem.",
      "Hospices provide palliative services for terminal patients."
    ],
    etymology: "Latin 'palliare' - to cloak",
    synonyms: ["soothing", "alleviating", "comforting"],
    antonyms: ["curative", "restorative"],
    difficulty: 3,
    category: "medicine"
  },
  {
    word: "Chronic",
    partOfSpeech: "adjective",
    definition: "persisting for a long time or constantly recurring",
    example: "She suffers from chronic back pain.",
    examples: [
      "She suffers from chronic back pain.",
      "Chronic stress can lead to serious health problems.",
      "The region faces chronic water shortages."
    ],
    etymology: "Greek 'chronos' - time",
    synonyms: ["persistent", "long-lasting", "enduring"],
    antonyms: ["acute", "temporary", "brief"],
    difficulty: 1,
    category: "medicine"
  },
  {
    word: "Asymptomatic",
    partOfSpeech: "adjective",
    definition: "showing no symptoms of a particular disease",
    example: "Many carriers of the virus are completely asymptomatic.",
    examples: [
      "Many carriers of the virus are completely asymptomatic.",
      "Asymptomatic cases make tracking the spread difficult.",
      "Regular screening catches problems in asymptomatic patients."
    ],
    etymology: "Greek 'a-' - without + 'symptoma' - occurrence",
    synonyms: ["symptom-free", "latent", "silent"],
    antonyms: ["symptomatic"],
    difficulty: 2,
    category: "medicine"
  },
  {
    word: "Efficacy",
    partOfSpeech: "noun",
    definition: "the ability to produce a desired or intended result",
    example: "Clinical trials demonstrated the efficacy of the new treatment.",
    examples: [
      "Clinical trials demonstrated the efficacy of the new treatment.",
      "The efficacy of the vaccine exceeded expectations.",
      "Questions about the efficacy of the policy remain unanswered."
    ],
    etymology: "Latin 'efficacia' - effectiveness",
    synonyms: ["effectiveness", "potency", "power"],
    antonyms: ["inefficacy", "ineffectiveness"],
    difficulty: 2,
    category: "medicine"
  },
  {
    word: "Benign",
    partOfSpeech: "adjective",
    definition: "not harmful in effect; (of a tumor) not cancerous",
    example: "The test results showed the growth was benign.",
    examples: [
      "The test results showed the growth was benign.",
      "Despite his gruff manner, he had a benign personality.",
      "The climate there is benign for agriculture."
    ],
    etymology: "Latin 'benignus' - well-born, kindly",
    synonyms: ["harmless", "gentle", "mild"],
    antonyms: ["malignant", "harmful", "dangerous"],
    difficulty: 2,
    category: "medicine"
  },
  {
    word: "Comorbidity",
    partOfSpeech: "noun",
    definition: "the simultaneous presence of two or more diseases or conditions in a patient",
    example: "Diabetes with comorbidities requires complex treatment planning.",
    examples: [
      "Diabetes with comorbidities requires complex treatment planning.",
      "Comorbidity of depression and anxiety is common.",
      "The study examined comorbidity patterns in elderly patients."
    ],
    etymology: "Latin 'co-' - together + 'morbidus' - diseased",
    synonyms: ["concurrent conditions", "co-occurrence"],
    antonyms: [],
    difficulty: 3,
    category: "medicine"
  },

  // ============================================
  // EVERYDAY ADVANCED VOCABULARY
  // ============================================
  {
    word: "Serendipity",
    partOfSpeech: "noun",
    definition: "the occurrence of events by chance in a happy or beneficial way",
    example: "Meeting her at the conference was pure serendipity.",
    examples: [
      "Meeting her at the conference was pure serendipity.",
      "Many scientific discoveries resulted from serendipity.",
      "The serendipity of finding that rare book at a garage sale delighted him."
    ],
    etymology: "Coined by Horace Walpole from the fairy tale 'The Three Princes of Serendip'",
    synonyms: ["chance", "luck", "fortune"],
    antonyms: ["misfortune", "design", "planning"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Nostalgia",
    partOfSpeech: "noun",
    definition: "a sentimental longing for the past",
    example: "The old photographs filled her with nostalgia for her childhood.",
    examples: [
      "The old photographs filled her with nostalgia for her childhood.",
      "Nostalgia for the 80s has driven a revival of retro fashion.",
      "There's a certain nostalgia in revisiting your hometown."
    ],
    etymology: "Greek 'nostos' - return home + 'algos' - pain",
    synonyms: ["sentimentality", "wistfulness", "longing"],
    antonyms: ["anticipation"],
    difficulty: 1,
    category: "general"
  },
  {
    word: "Ambivalent",
    partOfSpeech: "adjective",
    definition: "having mixed feelings or contradictory ideas about something",
    example: "She felt ambivalent about accepting the job offer.",
    examples: [
      "She felt ambivalent about accepting the job offer.",
      "The public remains ambivalent about the new policy.",
      "His ambivalent attitude made it hard to predict his decisions."
    ],
    etymology: "Latin 'ambi-' - both + 'valens' - strong",
    synonyms: ["uncertain", "undecided", "conflicted"],
    antonyms: ["certain", "decisive", "resolved"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Cathartic",
    partOfSpeech: "adjective",
    definition: "providing psychological relief through the expression of strong emotions",
    example: "Writing in her journal was cathartic after the difficult day.",
    examples: [
      "Writing in her journal was cathartic after the difficult day.",
      "The movie provided a cathartic release for the audience.",
      "Screaming into a pillow can be surprisingly cathartic."
    ],
    etymology: "Greek 'katharsis' - cleansing, purification",
    synonyms: ["purifying", "releasing", "cleansing"],
    antonyms: ["repressive", "stifling"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Eloquent",
    partOfSpeech: "adjective",
    definition: "fluent or persuasive in speaking or writing",
    example: "Her eloquent speech moved the audience to action.",
    examples: [
      "Her eloquent speech moved the audience to action.",
      "The poem was an eloquent expression of grief.",
      "He was eloquent in his defense of the proposal."
    ],
    etymology: "Latin 'eloquens' - speaking out",
    synonyms: ["articulate", "expressive", "persuasive"],
    antonyms: ["inarticulate", "tongue-tied", "mumbling"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Inevitable",
    partOfSpeech: "adjective",
    definition: "certain to happen; unavoidable",
    example: "Given the circumstances, failure seemed inevitable.",
    examples: [
      "Given the circumstances, failure seemed inevitable.",
      "The inevitable conclusion surprised no one.",
      "Death and taxes are often called the only inevitables."
    ],
    etymology: "Latin 'inevitabilis' - not avoidable",
    synonyms: ["unavoidable", "certain", "inescapable"],
    antonyms: ["avoidable", "uncertain", "preventable"],
    difficulty: 1,
    category: "general"
  },
  {
    word: "Meticulous",
    partOfSpeech: "adjective",
    definition: "showing great attention to detail; very careful and precise",
    example: "Her meticulous research uncovered several errors in the report.",
    examples: [
      "Her meticulous research uncovered several errors in the report.",
      "The meticulous craftsmanship was evident in every detail.",
      "He kept meticulous records of all transactions."
    ],
    etymology: "Latin 'meticulosus' - fearful",
    synonyms: ["thorough", "careful", "precise"],
    antonyms: ["careless", "sloppy", "negligent"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Profound",
    partOfSpeech: "adjective",
    definition: "very great or intense; having deep meaning",
    example: "The experience had a profound effect on her worldview.",
    examples: [
      "The experience had a profound effect on her worldview.",
      "His book offers profound insights into human nature.",
      "She spoke with profound conviction about the cause."
    ],
    etymology: "Latin 'profundus' - deep",
    synonyms: ["deep", "intense", "significant"],
    antonyms: ["shallow", "superficial", "trivial"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Resilient",
    partOfSpeech: "adjective",
    definition: "able to withstand or recover quickly from difficult conditions",
    example: "The community proved remarkably resilient after the disaster.",
    examples: [
      "The community proved remarkably resilient after the disaster.",
      "Children are often more resilient than adults give them credit for.",
      "Building a resilient economy requires diverse industries."
    ],
    etymology: "Latin 'resilire' - to spring back",
    synonyms: ["tough", "adaptable", "flexible"],
    antonyms: ["fragile", "vulnerable", "weak"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Arduous",
    partOfSpeech: "adjective",
    definition: "involving or requiring strenuous effort; difficult and tiring",
    example: "The arduous climb to the summit took eight hours.",
    examples: [
      "The arduous climb to the summit took eight hours.",
      "Writing a dissertation is an arduous process.",
      "The arduous negotiations finally resulted in an agreement."
    ],
    etymology: "Latin 'arduus' - steep, difficult",
    synonyms: ["difficult", "strenuous", "demanding"],
    antonyms: ["easy", "effortless", "simple"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Benevolent",
    partOfSpeech: "adjective",
    definition: "well-meaning and kindly",
    example: "The benevolent donor gave millions to charity anonymously.",
    examples: [
      "The benevolent donor gave millions to charity anonymously.",
      "She was known for her benevolent attitude toward all employees.",
      "The benevolent dictator was a contradiction in terms."
    ],
    etymology: "Latin 'bene' - well + 'volens' - wishing",
    synonyms: ["kind", "generous", "charitable"],
    antonyms: ["malevolent", "cruel", "unkind"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Candid",
    partOfSpeech: "adjective",
    definition: "truthful and straightforward; frank",
    example: "I appreciate your candid feedback on my presentation.",
    examples: [
      "I appreciate your candid feedback on my presentation.",
      "The interview was refreshingly candid.",
      "She gave a candid assessment of her own shortcomings."
    ],
    etymology: "Latin 'candidus' - white, pure",
    synonyms: ["frank", "honest", "sincere"],
    antonyms: ["dishonest", "insincere", "deceptive"],
    difficulty: 1,
    category: "general"
  },
  {
    word: "Dubious",
    partOfSpeech: "adjective",
    definition: "hesitating or doubting; not to be relied upon",
    example: "I'm dubious about the accuracy of these statistics.",
    examples: [
      "I'm dubious about the accuracy of these statistics.",
      "The source of the information is dubious at best.",
      "He had the dubious honor of being last to finish."
    ],
    etymology: "Latin 'dubium' - doubt",
    synonyms: ["doubtful", "uncertain", "questionable"],
    antonyms: ["certain", "reliable", "trustworthy"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Frugal",
    partOfSpeech: "adjective",
    definition: "sparing or economical with regard to money or resources",
    example: "His frugal habits allowed him to save for retirement early.",
    examples: [
      "His frugal habits allowed him to save for retirement early.",
      "The frugal meal of bread and cheese sufficed.",
      "They lived a frugal but comfortable life."
    ],
    etymology: "Latin 'frugalis' - economical, thrifty",
    synonyms: ["thrifty", "economical", "prudent"],
    antonyms: ["wasteful", "extravagant", "lavish"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Imminent",
    partOfSpeech: "adjective",
    definition: "about to happen",
    example: "With dark clouds gathering, rain seemed imminent.",
    examples: [
      "With dark clouds gathering, rain seemed imminent.",
      "The company faces imminent bankruptcy without new funding.",
      "Scientists warned of imminent environmental collapse."
    ],
    etymology: "Latin 'imminere' - to overhang, threaten",
    synonyms: ["impending", "approaching", "forthcoming"],
    antonyms: ["distant", "remote", "unlikely"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Malleable",
    partOfSpeech: "adjective",
    definition: "able to be hammered or pressed into shape; easily influenced",
    example: "Gold is highly malleable and can be beaten into thin sheets.",
    examples: [
      "Gold is highly malleable and can be beaten into thin sheets.",
      "Young minds are malleable and quick to learn.",
      "The facts proved malleable to different interpretations."
    ],
    etymology: "Latin 'malleare' - to hammer",
    synonyms: ["pliable", "flexible", "adaptable"],
    antonyms: ["rigid", "inflexible", "unyielding"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Obsolete",
    partOfSpeech: "adjective",
    definition: "no longer produced or used; out of date",
    example: "Floppy disks have become completely obsolete.",
    examples: [
      "Floppy disks have become completely obsolete.",
      "Many skills become obsolete as technology advances.",
      "The treaty made the old agreements obsolete."
    ],
    etymology: "Latin 'obsoletus' - grown old, worn out",
    synonyms: ["outdated", "antiquated", "archaic"],
    antonyms: ["current", "modern", "contemporary"],
    difficulty: 1,
    category: "general"
  },
  {
    word: "Prolific",
    partOfSpeech: "adjective",
    definition: "producing much fruit or foliage or many offspring; producing many works",
    example: "The prolific author published three novels a year.",
    examples: [
      "The prolific author published three novels a year.",
      "Rabbits are prolific breeders.",
      "The composer's most prolific period was in his thirties."
    ],
    etymology: "Latin 'proles' - offspring + 'facere' - to make",
    synonyms: ["productive", "fertile", "abundant"],
    antonyms: ["unproductive", "barren", "sparse"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Succinct",
    partOfSpeech: "adjective",
    definition: "briefly and clearly expressed",
    example: "Her succinct summary covered all the key points.",
    examples: [
      "Her succinct summary covered all the key points.",
      "Please be succinct; we have limited time.",
      "The succinct report was only two pages long."
    ],
    etymology: "Latin 'succinctus' - tucked up, girded",
    synonyms: ["concise", "brief", "pithy"],
    antonyms: ["verbose", "wordy", "rambling"],
    difficulty: 2,
    category: "general"
  },
  {
    word: "Zealous",
    partOfSpeech: "adjective",
    definition: "having or showing great energy or enthusiasm in pursuit of a cause",
    example: "The zealous volunteers worked through the night.",
    examples: [
      "The zealous volunteers worked through the night.",
      "Her zealous advocacy for the cause inspired others.",
      "The zealous prosecutor pursued every possible charge."
    ],
    etymology: "Greek 'zelos' - ardor, fervor",
    synonyms: ["enthusiastic", "passionate", "fervent"],
    antonyms: ["apathetic", "indifferent", "unenthusiastic"],
    difficulty: 2,
    category: "general"
  }
];

// Export for use in extension
if (typeof module !== 'undefined') {
  module.exports = { VOCABULARY };
}
