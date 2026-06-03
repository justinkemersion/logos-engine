-- Additional MVP passages for Reading Desk testing (corpus garden drafts available).
-- Run migration, then import drafts: pnpm agent:passage:import:iliad-1-2 (etc.)

insert into passages (id, work_id, section_id, citation_ref, sequence, greek_text, source_note) values
  (
    '00000000-0000-0000-0002-000000000004',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0001-000000000002',
    '1.2',
    2,
    'οὐλομένην ἣ μυρίʼ Ἀχαιοῖς ἄλγεʼ ἔθηκε',
    'Second line of the Iliad proem — the wrath that brought countless pains.'
  ),
  (
    '00000000-0000-0000-0002-000000000005',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0001-000000000002',
    '1.10',
    10,
    'νοῦσον ἀνὰ στρατὸν ὄρσε κακήν ὀλέκοντο δὲ λαοί',
    'Apollo sends plague through the camp — narrative pivot after the proem.'
  ),
  (
    '00000000-0000-0000-0002-000000000006',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0001-000000000002',
    '1.33',
    33,
    'ὣς ἔφατʼ ἔδεισεν δʼ ὃ γέρων καὶ ἐπείθετο μύθῳ',
    'Chryses yields to Agamemnon''s threat — assembly scene.'
  ),
  (
    '00000000-0000-0000-0002-000000000007',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000001',
    '1.2',
    2,
    'πλάγχθη ἐπεὶ Τροίης ἱερὸν πτολίεθρον ἔπερσεν',
    'Odyssey proem — wandered after sacking Troy.'
  ),
  (
    '00000000-0000-0000-0002-000000000008',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000001',
    '1.5',
    5,
    'ἀρνύμενος ἥν τε ψυχὴν καὶ νόστον ἑταίρων',
    'Odyssey proem — ψυχή and companions'' nostos.'
  ),
  (
    '00000000-0000-0000-0002-000000000009',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0001-000000000002',
    '1.60',
    60,
    'ἀλλʼ ἄγε μοι τόδε εἰπὲ καὶ ἀτρεκέως κατάλεξον',
    'Athena addresses Achilles — divine speech in the quarrel frame.'
  );
