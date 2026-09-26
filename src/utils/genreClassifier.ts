import { MediaSection } from '../types/catalog';

const GENRE_RULES: Record<string, string[]> = {
  'Azione': [
    'azion', 'agente', 'rapina', 'criminal', 'combatt', 'inseguiment', 'mission',
    'spia', 'gangster', 'mafi', 'duell', 'scontro', 'armi', 'vendett', 'mercenar'
  ],
  'Commedia': [
    'commedia', 'divertent', 'risat', 'umoristic', 'gag', 'equivoc', 'esilarant',
    'nozze', 'matrimonio', 'comico', 'amiconi', 'coppia', 'ironic', 'farsa'
  ],
  'Drammatico': [
    'dramm', 'sofferen', 'tragic', 'malat', 'perdit', 'dolor', 'crisi', 'lutto',
    'difficil', 'solitudin', 'disperazion', 'conflitto interiore', 'angoscia'
  ],
  'Fantascienza': [
    'fantascienza', 'spazio', 'alien', 'futur', 'navicell', 'pianet', 'robot',
    'astronav', 'post-apocalittic', 'laboratorio', 'virus', 'cyborg', 'galassia',
    'monolite', 'intelligenza artificiale', 'dimensione'
  ],
  'Horror': [
    'horror', 'mostr', 'terror', 'demon', 'infestat', 'zombie', 'incubo',
    'assassin', 'sangu', 'paur', 'fantasmi', 'maledizion', 'occulto', 'soprannaturale'
  ],
  'Thriller': [
    'thriller', 'indagin', 'assassinio', 'mister', 'delitt', 'poliziesc',
    'colpevol', 'omicidio', 'cospirazion', 'complott', 'segreto', 'rapito', 'sospett'
  ],
  'Avventura': [
    'avventur', 'viaggio', 'tesor', 'esplorazion', 'sopravvivenza', 'desert',
    'giungla', 'sperdut', 'ocean', 'corsa', 'scalator', 'canyon', 'spedizione'
  ],
  'Fantasy': [
    'magia', 'drago', 'mago', 'regno', 'streg', 'incantesim', 'epic',
    'spada', 'creatur', 'elfi', 'superero', 'mitico', 'divinità'
  ],
  'Romantico': [
    'amor', 'innamor', 'romantic', 'fidanzat', 'amant', 'colpo di fulmine',
    'sentimento', 'passione', 'affetto'
  ],
  'Poliziesco': [
    'polizia', 'poliziotto', 'detective', 'fbi', 'giustizia', 'tangentopoli',
    'boss', 'ispettore', 'tribunale', 'processo'
  ],
  'Animazione': [
    'animat', 'cartoon', 'anime', 'manga', 'disney', 'pixar', 'cartone'
  ]
};

export function classifyGenres(titolo: string, trama: string, section: MediaSection): string[] {
  const text = `${titolo} ${trama}`.toLowerCase();
  const matched: string[] = [];

  // Animation section rule
  if (section === 'anime' || section === 'cartoon') {
    matched.push('Animazione');
  }

  for (const [genre, keywords] of Object.entries(GENRE_RULES)) {
    if (genre === 'Animazione' && (section === 'anime' || section === 'cartoon')) {
      continue;
    }
    const hasMatch = keywords.some(kw => text.includes(kw));
    if (hasMatch) {
      matched.push(genre);
    }
  }

  if (matched.length === 0) {
    matched.push(section === 'film' ? 'Cinema' : 'Serie');
  }

  return matched;
}

export const AVAILABLE_GENRES = [
  'Azione',
  'Commedia',
  'Drammatico',
  'Fantascienza',
  'Horror',
  'Thriller',
  'Avventura',
  'Fantasy',
  'Romantico',
  'Poliziesco',
  'Animazione',
  'Cinema',
  'Serie'
];
