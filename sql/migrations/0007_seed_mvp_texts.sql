-- MVP seed data
-- Three passages: Odyssey 1.1, Iliad 1.1, Republic 327a
-- Full token set + translation layers for Odyssey 1.1
-- Concept threads, authenticity profiles, one fragment

-- ---------------------------------------------------------------------------
-- Works
-- ---------------------------------------------------------------------------
insert into works (id, slug, title, original_title, author, tradition, description) values
  (
    '00000000-0000-0000-0000-000000000001',
    'odyssey',
    'Odyssey',
    'Ὀδύσσεια',
    'Homer',
    'Epic',
    'The story of Odysseus'' return from Troy. The poem opens with ''the man of many turns'' — a figure whose identity is motion itself.'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'iliad',
    'Iliad',
    'Ἰλιάς',
    'Homer',
    'Epic',
    'The rage of Achilles and the siege of Troy. The poem opens with μῆνις — a word that names the force driving the entire poem.'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'republic',
    'Republic',
    'Πολιτεία',
    'Plato',
    'Philosophy',
    'Plato''s inquiry into justice, the soul, and the just city. Republic 327a begins with Socrates'' descent to the Piraeus — a word that will echo through the whole dialogue.'
  );

-- ---------------------------------------------------------------------------
-- Sections
-- ---------------------------------------------------------------------------
insert into sections (id, work_id, slug, title, sequence, citation_label) values
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'book-1',
    'Book 1',
    1,
    'Book 1'
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'book-1',
    'Book 1',
    1,
    'Book 1'
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'book-1',
    'Book I',
    1,
    'Book I'
  );

-- ---------------------------------------------------------------------------
-- Passages
-- ---------------------------------------------------------------------------
insert into passages (id, work_id, section_id, citation_ref, sequence, greek_text, source_note) values
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000001',
    '1.1',
    1,
    'ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον',
    'Opening line of the Odyssey. Sandwiches Μοῦσα between the object (ἄνδρα) and the defining epithet (πολύτροπον).'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0001-000000000002',
    '1.1',
    1,
    'Μῆνιν ἄειδε, θεά, Πηληϊάδεω Ἀχιλῆος',
    'Opening line of the Iliad. Μῆνιν is the first word — the poem begins with rage before the hero is named.'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0001-000000000003',
    '327a',
    1,
    'Κατέβην χθὲς εἰς Πειραιᾶ μετὰ Γλαύκωνος τοῦ Ἀρίστωνος',
    'Opening sentence of the Republic. Κατέβην (I went down) will resonate with the allegory of the cave and with Odysseus'' descent to the underworld.'
  );

-- ---------------------------------------------------------------------------
-- Tokens: Odyssey 1.1
-- ---------------------------------------------------------------------------
insert into tokens (id, passage_id, token_index, surface, lemma, transliteration, morphology, literal_gloss, note) values
  (
    '00000000-0000-0000-0003-000000000001',
    '00000000-0000-0000-0002-000000000001',
    1,
    'ἄνδρα',
    'ἀνήρ',
    'andra',
    'noun, accusative singular masculine',
    'man',
    'The opening object. Odysseus appears first as ''man'' before being named. The poem begins with the category, not the individual.'
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    '00000000-0000-0000-0002-000000000001',
    2,
    'μοι',
    'ἐγώ',
    'moi',
    'pronoun, dative singular',
    'to me',
    'Dative of the narrator — the poem is addressed to the Muse as a request on the poet''s behalf.'
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    '00000000-0000-0000-0002-000000000001',
    3,
    'ἔννεπε',
    'ἐννέπω',
    'ennepe',
    'verb, imperative aorist active 2nd singular',
    'tell / recount',
    'An imperative to the Muse: tell me. The verb carries the weight of oral performance — this is commanded telling, not casual narration.'
  ),
  (
    '00000000-0000-0000-0003-000000000004',
    '00000000-0000-0000-0002-000000000001',
    4,
    'Μοῦσα',
    'Μοῦσα',
    'Mousa',
    'noun, nominative singular feminine (vocative)',
    'Muse',
    'The divine source of epic poetry. Named after ἄνδρα and before πολύτροπον — the Muse mediates between the subject and his defining quality.'
  ),
  (
    '00000000-0000-0000-0003-000000000005',
    '00000000-0000-0000-0002-000000000001',
    5,
    'πολύτροπον',
    'πολύτροπος',
    'polytropon',
    'adjective, accusative singular masculine',
    'many-turned',
    'The defining epithet of Odysseus. πολύ (many) + τρόπος (turn, way, manner). Resists any single English rendering: cunning, wily, of many ways, much-traveled, adaptable. The compound is the point — identity is constituted by multiplicity of turn.'
  );

-- ---------------------------------------------------------------------------
-- Tokens: Iliad 1.1 (minimal — enough to show the pipeline)
-- ---------------------------------------------------------------------------
insert into tokens (id, passage_id, token_index, surface, lemma, transliteration, morphology, literal_gloss, note) values
  (
    '00000000-0000-0000-0003-000000000010',
    '00000000-0000-0000-0002-000000000002',
    1,
    'Μῆνιν',
    'μῆνις',
    'Mēnin',
    'noun, accusative singular feminine',
    'rage',
    'The first word of the Iliad and of the Western literary tradition. Placed first — before the verb, before the goddess, before Achilles. The poem is named by its subject before anything else is said.'
  ),
  (
    '00000000-0000-0000-0003-000000000011',
    '00000000-0000-0000-0002-000000000002',
    2,
    'ἄειδε',
    'ἀείδω',
    'aeide',
    'verb, imperative present active 2nd singular',
    'sing',
    'The command to sing rather than tell (ἔννεπε in the Odyssey). The Iliad is a song; the Odyssey is a narration. This distinction is embedded in the first word of each.'
  ),
  (
    '00000000-0000-0000-0003-000000000012',
    '00000000-0000-0000-0002-000000000002',
    3,
    'θεά',
    'θεά',
    'thea',
    'noun, nominative singular feminine (vocative)',
    'goddess',
    'The Iliad addresses an unnamed goddess rather than the Muse by name. A smaller but interesting divergence from the Odyssey''s opening.'
  );

-- ---------------------------------------------------------------------------
-- Tokens: Republic 327a (minimal)
-- ---------------------------------------------------------------------------
insert into tokens (id, passage_id, token_index, surface, lemma, transliteration, morphology, literal_gloss, note) values
  (
    '00000000-0000-0000-0003-000000000020',
    '00000000-0000-0000-0002-000000000003',
    1,
    'Κατέβην',
    'καταβαίνω',
    'Katebēn',
    'verb, indicative aorist active 1st singular',
    'I went down',
    'The Republic begins with a descent. Socrates went down to the Piraeus. The verb will resonate with the cave allegory (Book VII) and with Odysseus'' katabasis. Descent as philosophical movement is seeded in the first word.'
  ),
  (
    '00000000-0000-0000-0003-000000000021',
    '00000000-0000-0000-0002-000000000003',
    2,
    'χθὲς',
    'χθές',
    'chthes',
    'adverb',
    'yesterday',
    'The Republic begins in specific time — yesterday. This is not mythic time but civic, quotidian time. Socrates is a man who goes places and comes back to talk about it.'
  );

-- ---------------------------------------------------------------------------
-- Translation layers: Odyssey 1.1
-- ---------------------------------------------------------------------------
insert into translation_layers (passage_id, layer, content, status) values
  (
    '00000000-0000-0000-0002-000000000001',
    'raw_greek',
    'ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον',
    'accepted'
  ),
  (
    '00000000-0000-0000-0002-000000000001',
    'literal',
    'Man to-me tell, Muse, many-turned.',
    'accepted'
  ),
  (
    '00000000-0000-0000-0002-000000000001',
    'readable',
    'Tell me, Muse, of the man of many turns.',
    'accepted'
  ),
  (
    '00000000-0000-0000-0002-000000000001',
    'philosophical',
    'Begin with the man whose identity is motion: cunning, wandering, and never only one thing. The Muse is asked to speak not of a name but of a type — the many-turned one — before Odysseus is ever named.',
    'accepted'
  );

-- ---------------------------------------------------------------------------
-- Translation layers: Iliad 1.1
-- ---------------------------------------------------------------------------
insert into translation_layers (passage_id, layer, content, status) values
  (
    '00000000-0000-0000-0002-000000000002',
    'raw_greek',
    'Μῆνιν ἄειδε, θεά, Πηληϊάδεω Ἀχιλῆος',
    'accepted'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    'literal',
    'Rage sing, goddess, of Peleus-son Achilles.',
    'accepted'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    'readable',
    'Sing, goddess, the rage of Achilles, son of Peleus.',
    'accepted'
  );

-- ---------------------------------------------------------------------------
-- Translation layers: Republic 327a
-- ---------------------------------------------------------------------------
insert into translation_layers (passage_id, layer, content, status) values
  (
    '00000000-0000-0000-0002-000000000003',
    'raw_greek',
    'Κατέβην χθὲς εἰς Πειραιᾶ μετὰ Γλαύκωνος τοῦ Ἀρίστωνος',
    'accepted'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    'literal',
    'I-went-down yesterday to Piraeus with Glaucon the of-Ariston.',
    'accepted'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    'readable',
    'I went down to the Piraeus yesterday with Glaucon, the son of Ariston.',
    'accepted'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    'philosophical',
    'The Republic begins with descent. The first word, κατέβην, plants the verb of going-down before any argument has started. Socrates descends to the port town — the place of trade, foreigners, and democratic mixing — and will spend the night talking about justice.',
    'accepted'
  );

-- ---------------------------------------------------------------------------
-- Translation variants: πολύτροπον (Odyssey 1.1)
-- ---------------------------------------------------------------------------
insert into translation_variants (
  passage_id, token_id, phrase, variant, variant_type, rationale, confidence, tradeoff_note
) values
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0003-000000000005',
    'πολύτροπον',
    'many-turned',
    'literal',
    'Preserves the compound structure of πολύ (many) + τρόπος (turn, way, manner).',
    'high',
    'Preserves the etymological layers and resists collapse into a single English trait word. "Many-turned" keeps the reader aware that the epithet is a compound — that identity here is constituted by multiplicity. Loses the sonic weight and familiarity of the Greek. Sounds slightly archaic in English, which is either a feature or a cost depending on the reader.'
  ),
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0003-000000000005',
    'πολύτροπον',
    'of many devices',
    'readable',
    'Emphasizes the cunning and resourcefulness aspects of the epithet.',
    'medium',
    'Readable and Homeric in register. Captures the practical cleverness (μῆτις) dimension of Odysseus. But "devices" implies tools and schemes rather than the deeper sense of multiple ways of being. Flattens the ontological suggestion that Odysseus is constituted by multiplicity.'
  ),
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0003-000000000005',
    'πολύτροπον',
    'much-wandering',
    'poetic',
    'Reads τρόπος as turn/direction and emphasizes the journey dimension.',
    'medium',
    'Foregrounds the travel and wandering dimension of the poem — which is accurate, since Odysseus does wander. But it collapses the epithet into a description of action rather than a characterization of identity. The poem is about how Odysseus is, not just where he goes.'
  );

-- ---------------------------------------------------------------------------
-- Concept threads
-- ---------------------------------------------------------------------------
insert into concept_threads (id, slug, label, greek_term, description) values
  (
    '00000000-0000-0000-0004-000000000001',
    'polytropos',
    'many-turned',
    'πολύτροπος',
    'The defining epithet of Odysseus — a figure of radical adaptability and multiple modes of being. The concept runs through the Odyssey as a structural principle: Odysseus is whoever he needs to be. In later tradition, the term resonates with the sophistic ideal of flexibility and with Platonic suspicion of the shape-shifter. The concept asks whether identity is a fixed essence or a repertoire of turns.'
  ),
  (
    '00000000-0000-0000-0004-000000000002',
    'menis',
    'rage',
    'μῆνις',
    'The divine wrath that opens the Iliad. μῆνις is not ordinary anger (ὀργή) but a sustained, righteous, almost cosmic indignation — the kind the gods feel when their due is denied. Achilles'' μῆνις is the poem''s subject and its engine. The word will recur in later Greek theology as the anger of gods toward impiety. It is one of the few Greek words that has no clean Latin equivalent and no clean English one.'
  ),
  (
    '00000000-0000-0000-0004-000000000003',
    'logos',
    'speech, account, reason',
    'λόγος',
    'Perhaps the most contested word in ancient Greek. In ordinary usage: word, speech, account, ratio. In Heraclitus (fl. 500 BCE): the ordering principle of the cosmos, which all share but few understand. In Plato: the rational account one gives of something — logos as the ability to say why. In the Stoics: the divine rational principle pervading the universe. In John 1:1 (ἐν ἀρχῇ ἦν ὁ λόγος): the Word that was God. The semantic trail of λόγος is the intellectual history of the ancient world. Never render it with a single English word without noting what is lost.'
  ),
  (
    '00000000-0000-0000-0004-000000000004',
    'dikaiosyne',
    'justice',
    'δικαιοσύνη',
    'The central question of the Republic. δικαιοσύνη is what Socrates and his interlocutors spend the entire dialogue trying to define. "Justice" is the standard translation, but it tends to suggest legal procedure. The Greek term is closer to right-ordering — of the city, of the soul, of one''s relations with others and with oneself. Plato''s argument is that the just person and the just city share a structural analogy. The word is not separable from the argument.'
  ),
  (
    '00000000-0000-0000-0004-000000000005',
    'psyche',
    'soul',
    'ψυχή',
    'In Homer, ψυχή is the life-breath that leaves the body at death — not a seat of consciousness but the animating principle itself. In Plato, ψυχή becomes the immortal, rational core of the person — the thing that survives death and is judged. "Soul" is the standard English rendering but carries Christian theological weight that the Greek does not. "Psyche" as transliteration is cleaner. The word''s journey from Homeric life-breath to Platonic immortal soul to modern "psychology" is one of the great semantic migrations in Western thought.'
  );

-- ---------------------------------------------------------------------------
-- Concept mentions: link concepts to passages and tokens
-- ---------------------------------------------------------------------------
insert into concept_mentions (concept_id, passage_id, token_id, note) values
  -- πολύτροπος → Odyssey 1.1 token
  (
    '00000000-0000-0000-0004-000000000001',
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0003-000000000005',
    'πολύτροπον is the first direct occurrence of the concept in the corpus.'
  ),
  -- μῆνις → Iliad 1.1 token
  (
    '00000000-0000-0000-0004-000000000002',
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0003-000000000010',
    'Μῆνιν is the first word of the Iliad — the poem is named by its concept before its hero.'
  ),
  -- δικαιοσύνη → Republic 327a (passage-level — the word does not appear in 327a but the inquiry begins here)
  (
    '00000000-0000-0000-0004-000000000004',
    '00000000-0000-0000-0002-000000000003',
    null,
    'The Republic''s inquiry into δικαιοσύνη begins at 327a with Socrates'' descent — the physical movement that will become the structural metaphor for the whole argument.'
  );

-- ---------------------------------------------------------------------------
-- Authenticity profiles
-- ---------------------------------------------------------------------------
insert into authenticity_profiles (work_id, status, confidence_label, summary, signals) values
  (
    '00000000-0000-0000-0000-000000000001',
    'oral_tradition',
    'Tradition complex',
    'The Odyssey is attributed to Homer by ancient tradition, but the poems reflect oral-formulaic composition over generations. Single-author attribution is a later literary convention applied to an oral tradition. The text is well-preserved in manuscript tradition. The tonal difference from the Iliad (wandering vs. martial rage) is a feature of the poems'' different subjects, not evidence of different authorship.',
    '{
      "ancient_attribution": true,
      "manuscript_tradition": true,
      "oral_formulaic_structure": true,
      "tone_anomaly": false,
      "stylometry": null,
      "later_editorial_suspicion": false
    }'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'oral_tradition',
    'Tradition complex',
    'The Iliad is the older of the two Homeric poems and shows deep oral-formulaic structure throughout. Ancient attribution to Homer is consistent. The poems may reflect a bardic tradition rather than a single author. The martial register is distinct from the Odyssey''s tone of wandering and cunning — this is the nature of the subject matter, not an authorship signal.',
    '{
      "ancient_attribution": true,
      "manuscript_tradition": true,
      "oral_formulaic_structure": true,
      "tone_anomaly": false,
      "stylometry": null,
      "later_editorial_suspicion": false
    }'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'generally_accepted',
    'Strong for core dialogues',
    'The Republic is one of the most securely attributed of Plato''s dialogues. Ancient attestation is strong; manuscript tradition is rich; style and doctrine are consistent with early-to-middle Plato. The noble lie and myth of metals (Books III–IV) have generated interpretive controversy about Plato''s sincerity, but this is a reading question, not an authenticity question.',
    '{
      "ancient_attribution": true,
      "manuscript_tradition": true,
      "stylometry": true,
      "doctrinal_fit": true,
      "tone_anomaly": false,
      "later_editorial_suspicion": false
    }'::jsonb
  );

-- ---------------------------------------------------------------------------
-- Fragment: Timaeus (demonstration of /fragments route)
-- ---------------------------------------------------------------------------
insert into commentary_notes (passage_id, note_type, title, body) values
  (
    null,
    'fragment',
    'The cosmos as living creature',
    'Plato — Timaeus

"The cosmos is a living creature endowed with soul and reason."

Why it matters:
Reality itself is imagined as ordered, alive, and intelligible. This is not metaphor — it is Plato''s cosmological claim. The world is not a machine to be dissected but a creature to be understood. The concept of the world-soul (ψυχὴ τοῦ κόσμου) runs from Timaeus through the Stoics and into Neoplatonism. To read Plato is to inherit this vision of an ensouled cosmos.'
  );
