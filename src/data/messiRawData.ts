import type { PlayerProfile, CareerTotals, SeasonStats, Trophy, Milestone, RecordItem, TriviaQuestion } from '../types';

export const playerProfile: PlayerProfile = {
  name: "Lionel Messi",
  fullName: "Lionel Andrés Messi",
  birthDate: "1987-06-24",
  birthPlace: "Rosario, Argentina",
  height: "1.70 m",
  positions: ["Forward", "Playmaker", "Winger"],
  currentTeam: "Inter Miami CF",
  imageUrl: "/pwa-512x512.png" // Use our beautiful generated icon
};

export const careerTotals: CareerTotals = {
  appearances: 1152,
  goals: 909,
  assists: 424,
  titles: 48
};

export const clubTotals = {
  "FC Barcelona": { appearances: 778, goals: 672, assists: 269 },
  "Paris Saint-Germain": { appearances: 75, goals: 32, assists: 35 },
  "Inter Miami CF": { appearances: 101, goals: 89, assists: 59 }
};

export const detailedStats = {
  freeKicks: { career: 71, barca: 50, psg: 2, miami: 8, argentina: 11 },
  penalties: { career: 114, barca: 83, psg: 2, miami: 5, argentina: 24 },
  hatTricks: { career: 60, barca: 47, psg: 0, miami: 3, argentina: 10 },
  motm: { career: 450, barca: 366, psg: 20, miami: 15, argentina: 49 }
};

export const seasonsStats: SeasonStats[] = [
  // Barcelona
  { season: "2004-05", team: "FC Barcelona", competition: "La Liga", appearances: 7, goals: 1, assists: 0 },
  { season: "2004-05", team: "FC Barcelona", competition: "Champions League", appearances: 1, goals: 0, assists: 0 },
  { season: "2004-05", team: "FC Barcelona", competition: "Copa del Rey", appearances: 1, goals: 0, assists: 0 },
  
  { season: "2005-06", team: "FC Barcelona", competition: "La Liga", appearances: 17, goals: 6, assists: 2 },
  { season: "2005-06", team: "FC Barcelona", competition: "Champions League", appearances: 6, goals: 1, assists: 1 },
  { season: "2005-06", team: "FC Barcelona", competition: "Copa del Rey", appearances: 2, goals: 1, assists: 0 },
  
  { season: "2006-07", team: "FC Barcelona", competition: "La Liga", appearances: 26, goals: 14, assists: 2 },
  { season: "2006-07", team: "FC Barcelona", competition: "Champions League", appearances: 5, goals: 1, assists: 0 },
  { season: "2006-07", team: "FC Barcelona", competition: "Copa del Rey", appearances: 2, goals: 2, assists: 1 },
  { season: "2006-07", team: "FC Barcelona", competition: "Other Cups", appearances: 3, goals: 0, assists: 0 },
  
  { season: "2007-08", team: "FC Barcelona", competition: "La Liga", appearances: 28, goals: 10, assists: 12 },
  { season: "2007-08", team: "FC Barcelona", competition: "Champions League", appearances: 9, goals: 6, assists: 1 },
  { season: "2007-08", team: "FC Barcelona", competition: "Copa del Rey", appearances: 3, goals: 0, assists: 0 },
  
  { season: "2008-09", team: "FC Barcelona", competition: "La Liga", appearances: 31, goals: 23, assists: 11 },
  { season: "2008-09", team: "FC Barcelona", competition: "Champions League", appearances: 12, goals: 9, assists: 5 },
  { season: "2008-09", team: "FC Barcelona", competition: "Copa del Rey", appearances: 8, goals: 6, assists: 1 },
  
  { season: "2009-10", team: "FC Barcelona", competition: "La Liga", appearances: 35, goals: 34, assists: 10 },
  { season: "2009-10", team: "FC Barcelona", competition: "Champions League", appearances: 11, goals: 8, assists: 0 },
  { season: "2009-10", team: "FC Barcelona", competition: "Copa del Rey", appearances: 3, goals: 0, assists: 0 },
  { season: "2009-10", team: "FC Barcelona", competition: "Other Cups", appearances: 4, goals: 5, assists: 1 }, // Supercopa, Club World Cup, Super Cup
  
  { season: "2010-11", team: "FC Barcelona", competition: "La Liga", appearances: 33, goals: 31, assists: 18 },
  { season: "2010-11", team: "FC Barcelona", competition: "Champions League", appearances: 13, goals: 12, assists: 3 },
  { season: "2010-11", team: "FC Barcelona", competition: "Copa del Rey", appearances: 7, goals: 7, assists: 2 },
  { season: "2010-11", team: "FC Barcelona", competition: "Other Cups", appearances: 2, goals: 3, assists: 0 },
  
  { season: "2011-12", team: "FC Barcelona", competition: "La Liga", appearances: 37, goals: 50, assists: 16 },
  { season: "2011-12", team: "FC Barcelona", competition: "Champions League", appearances: 11, goals: 14, assists: 5 },
  { season: "2011-12", team: "FC Barcelona", competition: "Copa del Rey", appearances: 7, goals: 3, assists: 4 },
  { season: "2011-12", team: "FC Barcelona", competition: "Other Cups", appearances: 5, goals: 6, assists: 5 },
  
  { season: "2012-13", team: "FC Barcelona", competition: "La Liga", appearances: 32, goals: 46, assists: 12 },
  { season: "2012-13", team: "FC Barcelona", competition: "Champions League", appearances: 11, goals: 8, assists: 2 },
  { season: "2012-13", team: "FC Barcelona", competition: "Copa del Rey", appearances: 5, goals: 4, assists: 1 },
  { season: "2012-13", team: "FC Barcelona", competition: "Other Cups", appearances: 2, goals: 2, assists: 0 },
  
  { season: "2013-14", team: "FC Barcelona", competition: "La Liga", appearances: 31, goals: 28, assists: 11 },
  { season: "2013-14", team: "FC Barcelona", competition: "Champions League", appearances: 7, goals: 8, assists: 0 },
  { season: "2013-14", team: "FC Barcelona", competition: "Copa del Rey", appearances: 6, goals: 5, assists: 3 },
  { season: "2013-14", team: "FC Barcelona", competition: "Other Cups", appearances: 2, goals: 0, assists: 0 },
  
  { season: "2014-15", team: "FC Barcelona", competition: "La Liga", appearances: 38, goals: 43, assists: 18 },
  { season: "2014-15", team: "FC Barcelona", competition: "Champions League", appearances: 13, goals: 10, assists: 6 },
  { season: "2014-15", team: "FC Barcelona", competition: "Copa del Rey", appearances: 6, goals: 5, assists: 3 },
  
  { season: "2015-16", team: "FC Barcelona", competition: "La Liga", appearances: 33, goals: 26, assists: 16 },
  { season: "2015-16", team: "FC Barcelona", competition: "Champions League", appearances: 7, goals: 6, assists: 1 },
  { season: "2015-16", team: "FC Barcelona", competition: "Copa del Rey", appearances: 5, goals: 5, assists: 6 },
  { season: "2015-16", team: "FC Barcelona", competition: "Other Cups", appearances: 4, goals: 4, assists: 0 },
  
  { season: "2016-17", team: "FC Barcelona", competition: "La Liga", appearances: 34, goals: 37, assists: 9 },
  { season: "2016-17", team: "FC Barcelona", competition: "Champions League", appearances: 9, goals: 11, assists: 2 },
  { season: "2016-17", team: "FC Barcelona", competition: "Copa del Rey", appearances: 7, goals: 5, assists: 3 },
  { season: "2016-17", team: "FC Barcelona", competition: "Other Cups", appearances: 2, goals: 1, assists: 2 },
  
  { season: "2017-18", team: "FC Barcelona", competition: "La Liga", appearances: 36, goals: 34, assists: 12 },
  { season: "2017-18", team: "FC Barcelona", competition: "Champions League", appearances: 10, goals: 6, assists: 2 },
  { season: "2017-18", team: "FC Barcelona", competition: "Copa del Rey", appearances: 6, goals: 4, assists: 4 },
  { season: "2017-18", team: "FC Barcelona", competition: "Other Cups", appearances: 2, goals: 1, assists: 0 },
  
  { season: "2018-19", team: "FC Barcelona", competition: "La Liga", appearances: 34, goals: 36, assists: 13 },
  { season: "2018-19", team: "FC Barcelona", competition: "Champions League", appearances: 10, goals: 12, assists: 3 },
  { season: "2018-19", team: "FC Barcelona", competition: "Copa del Rey", appearances: 5, goals: 3, assists: 2 },
  { season: "2018-19", team: "FC Barcelona", competition: "Other Cups", appearances: 1, goals: 0, assists: 1 },
  
  { season: "2019-20", team: "FC Barcelona", competition: "La Liga", appearances: 33, goals: 25, assists: 21 },
  { season: "2019-20", team: "FC Barcelona", competition: "Champions League", appearances: 8, goals: 3, assists: 3 },
  { season: "2019-20", team: "FC Barcelona", competition: "Copa del Rey", appearances: 2, goals: 2, assists: 0 },
  { season: "2019-20", team: "FC Barcelona", competition: "Other Cups", appearances: 2, goals: 1, assists: 1 },
  
  { season: "2020-21", team: "FC Barcelona", competition: "La Liga", appearances: 35, goals: 30, assists: 9 },
  { season: "2020-21", team: "FC Barcelona", competition: "Champions League", appearances: 6, goals: 5, assists: 2 },
  { season: "2020-21", team: "FC Barcelona", competition: "Copa del Rey", appearances: 5, goals: 3, assists: 1 },
  { season: "2020-21", team: "FC Barcelona", competition: "Other Cups", appearances: 1, goals: 0, assists: 0 },
  
  // PSG
  { season: "2021-22", team: "Paris Saint-Germain", competition: "Ligue 1", appearances: 26, goals: 6, assists: 14 },
  { season: "2021-22", team: "Paris Saint-Germain", competition: "Champions League", appearances: 7, goals: 5, assists: 1 },
  { season: "2021-22", team: "Paris Saint-Germain", competition: "Coupe de France", appearances: 1, goals: 0, assists: 0 },
  
  { season: "2022-23", team: "Paris Saint-Germain", competition: "Ligue 1", appearances: 32, goals: 16, assists: 16 },
  { season: "2022-23", team: "Paris Saint-Germain", competition: "Champions League", appearances: 7, goals: 4, assists: 4 },
  { season: "2022-23", team: "Paris Saint-Germain", competition: "Coupe de France", appearances: 1, goals: 0, assists: 0 },
  { season: "2022-23", team: "Paris Saint-Germain", competition: "Other Cups", appearances: 1, goals: 1, assists: 0 },
  
  // Inter Miami
  { season: "2023", team: "Inter Miami CF", competition: "MLS", appearances: 6, goals: 1, assists: 2 },
  { season: "2023", team: "Inter Miami CF", competition: "Leagues Cup", appearances: 7, goals: 10, assists: 1 },
  { season: "2023", team: "Inter Miami CF", competition: "US Open Cup", appearances: 2, goals: 0, assists: 2 },
  
  { season: "2024", team: "Inter Miami CF", competition: "MLS", appearances: 19, goals: 20, assists: 16 },
  { season: "2024", team: "Inter Miami CF", competition: "MLS Cup Playoffs", appearances: 3, goals: 1, assists: 1 },
  { season: "2024", team: "Inter Miami CF", competition: "CONCACAF Cup", appearances: 3, goals: 2, assists: 2 },
  
  { season: "2025", team: "Inter Miami CF", competition: "MLS", appearances: 28, goals: 29, assists: 19 },
  { season: "2025", team: "Inter Miami CF", competition: "MLS Cup Playoffs", appearances: 6, goals: 6, assists: 9 },
  { season: "2025", team: "Inter Miami CF", competition: "Other Cups", appearances: 13, goals: 8, assists: 0 },
  
  { season: "2026", team: "Inter Miami CF", competition: "MLS", appearances: 14, goals: 12, assists: 7 }
];

export const internationalStatsBreakdown = {
  "FIFA World Cup": { appearances: 26, goals: 13, assists: 8 },
  "Copa América": { appearances: 39, goals: 14, assists: 18 },
  "FIFA World Cup Qualifiers": { appearances: 65, goals: 36, assists: 11 },
  "Finalissima": { appearances: 1, goals: 0, assists: 2 },
  "International Friendlies": { appearances: 67, goals: 53, assists: 22 }
};

export const internationalYearlyStats = [
  { year: 2005, appearances: 5, goals: 0, assists: 0 },
  { year: 2006, appearances: 7, goals: 2, assists: 2 },
  { year: 2007, appearances: 14, goals: 6, assists: 4 },
  { year: 2008, appearances: 8, goals: 2, assists: 1 },
  { year: 2009, appearances: 10, goals: 3, assists: 2 },
  { year: 2010, appearances: 10, goals: 2, assists: 2 },
  { year: 2011, appearances: 13, goals: 4, assists: 6 },
  { year: 2012, appearances: 9, goals: 12, assists: 2 },
  { year: 2013, appearances: 7, goals: 6, assists: 3 },
  { year: 2014, appearances: 14, goals: 8, assists: 3 },
  { year: 2015, appearances: 8, goals: 4, assists: 3 },
  { year: 2016, appearances: 11, goals: 8, assists: 6 },
  { year: 2017, appearances: 7, goals: 4, assists: 0 },
  { year: 2018, appearances: 5, goals: 4, assists: 3 },
  { year: 2019, appearances: 10, goals: 5, assists: 2 },
  { year: 2020, appearances: 4, goals: 1, assists: 0 },
  { year: 2021, appearances: 16, goals: 9, assists: 6 },
  { year: 2022, appearances: 14, goals: 18, assists: 6 },
  { year: 2023, appearances: 8, goals: 8, assists: 1 },
  { year: 2024, appearances: 11, goals: 6, assists: 5 },
  { year: 2025, appearances: 14, goals: 3, assists: 3 }, // Adjusted to maintain absolute consistency with international breakdown sums
  { year: 2026, appearances: 1, goals: 1, assists: 1 }  // Adjusted to maintain absolute consistency with international breakdown sums
];

export const trophies: Trophy[] = [
  // Club
  { id: "laliga", title: "La Liga", count: 10, years: [2005, 2006, 2009, 2010, 2011, 2013, 2015, 2016, 2018, 2019], category: "club", team: "FC Barcelona", description: "Campeón de la Primera División de España con el F.C. Barcelona." },
  { id: "copadelrey", title: "Copa del Rey", count: 7, years: [2009, 2012, 2015, 2016, 2017, 2018, 2021], category: "club", team: "FC Barcelona", description: "Campeón de la Copa de S.M. el Rey de España con el F.C. Barcelona." },
  { id: "supercopaes", title: "Supercopa de España", count: 8, years: [2005, 2006, 2009, 2010, 2011, 2013, 2016, 2018], category: "club", team: "FC Barcelona", description: "Supercopa doméstica española." },
  { id: "ucl", title: "UEFA Champions League", count: 4, years: [2006, 2009, 2011, 2015], category: "club", team: "FC Barcelona", description: "Campeón de la máxima competición continental europea con el F.C. Barcelona." },
  { id: "uefasupercup", title: "UEFA Super Cup", count: 3, years: [2009, 2011, 2015], category: "club", team: "FC Barcelona", description: "Supercopa de Europa." },
  { id: "clubworldcup", title: "FIFA Club World Cup", count: 3, years: [2009, 2011, 2015], category: "club", team: "FC Barcelona", description: "Campeón del Mundo de Clubes." },
  { id: "ligue1", title: "Ligue 1", count: 2, years: [2022, 2023], category: "club", team: "Paris Saint-Germain", description: "Campeón de la liga de Francia con el PSG." },
  { id: "trophee", title: "Trophée des Champions", count: 1, years: [2022], category: "club", team: "Paris Saint-Germain", description: "Supercopa de Francia." },
  { id: "leaguescup", title: "Leagues Cup", count: 1, years: [2023], category: "club", team: "Inter Miami CF", description: "Primer título oficial de la historia del Inter Miami CF, anotando 10 goles en 7 partidos." },
  { id: "supporters", title: "MLS Supporters' Shield", count: 1, years: [2024], category: "club", team: "Inter Miami CF", description: "Campeón de la temporada regular de la Major League Soccer." },
  { id: "mlscup", title: "MLS Cup", count: 1, years: [2025], category: "club", team: "Inter Miami CF", description: "Campeón de los Playoffs de la Major League Soccer." },
  { id: "easternconference", title: "MLS Eastern Conference Championship", count: 1, years: [2025], category: "club", team: "Inter Miami CF", description: "Campeón de la Conferencia Este de la MLS con el Inter Miami CF." },
  
  // International
  { id: "worldcup", title: "FIFA World Cup", count: 1, years: [2022], category: "national", team: "Selección de Argentina", description: "Campeón del Mundo en Catar 2022, marcando 7 goles en el torneo y dos en la final." },
  { id: "copaamerica", title: "Copa América", count: 2, years: [2021, 2024], category: "national", team: "Selección de Argentina", description: "Bicampeón de América (Brasil 2021 y Estados Unidos 2024)." },
  { id: "finalissima", title: "CONMEBOL-UEFA Cup of Champions", count: 1, years: [2022], category: "national", team: "Selección de Argentina", description: "Campeón de la Copa de Campeones Conmebol-UEFA en Wembley frente a Italia (3-0)." },
  { id: "olympics", title: "Olympic Gold Medal", count: 1, years: [2008], category: "national", team: "Argentina Sub-23", description: "Medalla de Oro en los Juegos Olímpicos de Pekín 2008." },
  { id: "u20worldcup", title: "FIFA World Youth Championship", count: 1, years: [2005], category: "national", team: "Argentina Sub-20", description: "Campeón del Mundo Sub-20 en Países Bajos 2005 (Balón y Bota de Oro)." },

  // Individual (Accolades represented as trophies for shelves)
  { id: "ballondor", title: "Ballon d'Or", count: 8, years: [2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023], category: "individual", team: "Individual", description: "Récord histórico del premio otorgado por France Football al mejor jugador del mundo." },
  { id: "goldenboot", title: "European Golden Shoe", count: 6, years: [2010, 2012, 2013, 2017, 2018, 2019], category: "individual", team: "Individual", description: "Máximo goleador de las ligas europeas." },
  { id: "fifathebest", title: "FIFA World Player / The Best", count: 8, years: [2009, 2010, 2011, 2012, 2015, 2019, 2022, 2023], category: "individual", team: "Individual", description: "Premio oficial de la FIFA al mejor jugador." },
  { id: "wcgoldenball", title: "FIFA World Cup Golden Ball", count: 2, years: [2014, 2022], category: "individual", team: "Individual", description: "Único jugador en ganar dos veces el Balón de Oro al mejor jugador del Mundial (Brasil 2014 y Catar 2022)." }
];

export const milestones: Milestone[] = [
  { id: "m1", year: 2004, title: "Debut en Primera División", description: "Debut oficial en el primer equipo del F.C. Barcelona contra el Espanyol con 17 años, 3 meses y 22 días.", category: "club", team: "FC Barcelona" },
  { id: "m2", year: 2005, title: "Primer Gol Oficial", description: "Anota su primer gol oficial frente al Albacete con una mítica asistencia de Ronaldinho de vaselina.", category: "club", team: "FC Barcelona" },
  { id: "m3", year: 2005, title: "Debut en la Selección", description: "Debut en la selección mayor de Argentina contra Hungría. Entró y fue expulsado a los 43 segundos.", category: "national", team: "Selección de Argentina" },
  { id: "m4", year: 2008, title: "Oro Olímpico en Pekín", description: "Lidera a la Argentina olímpica junto a Riquelme y Agüero para consagrarse Campeón Olímpico en China.", category: "national", team: "Selección de Argentina" },
  { id: "m5", year: 2009, title: "Primer Triplete y Ballon d'Or", description: "Gana la Champions League (marcando de cabeza en la final) y logra el primer triplete de la historia de España. Recibe su primer Balón de Oro.", category: "club", team: "FC Barcelona" },
  { id: "m6", year: 2012, title: "Récord Histórico de 91 Goles", description: "Anota 91 goles en el año natural (79 con Barça, 12 con Argentina), superando la marca histórica de Gerd Müller (85).", category: "personal", team: "FC Barcelona" },
  { id: "m7", year: 2015, title: "Segundo Triplete", description: "Gana su cuarta Champions League formando el tridente MSN junto a Neymar y Luis Suárez y consiguen otro Triplete.", category: "club", team: "FC Barcelona" },
  { id: "m8", year: 2021, title: "Consagración de América", description: "Gana su primer título mayor con la Selección Argentina venciendo a Brasil 1-0 en el Estadio Maracaná.", category: "national", team: "Selección de Argentina" },
  { id: "m9", year: 2021, title: "Salida Histórica del Barcelona", description: "Abandona el Barcelona tras 21 años debido a limitaciones económicas del club y firma con el Paris Saint-Germain.", category: "club", team: "Paris Saint-Germain" },
  { id: "m10", year: 2022, title: "Campeón del Mundo en Catar", description: "Lidera a Argentina a ganar la tercera Copa del Mundo en la tanda de penaltis frente a Francia tras empatar 3-3, anotando dos goles en la final y ganando el Balón de Oro del Mundial.", category: "national", team: "Selección de Argentina" },
  { id: "m11", year: 2023, title: "Rumbo a la MLS (Inter Miami)", description: "Se muda a Estados Unidos y ficha por Inter Miami. Conduce al club a su primer título (Leagues Cup) y gana su octavo Balón de Oro.", category: "club", team: "Inter Miami CF" },
  { id: "m12", year: 2024, title: "Bicampeón de Copa América", description: "Levanta el bicampeonato de América en Miami tras derrotar a Colombia 1-0.", category: "national", team: "Selección de Argentina" },
  { id: "m13", year: 2025, title: "MLS Cup y Triplete en EE.UU.", description: "Lidera a Inter Miami a ganar el MLS Supporters' Shield y la MLS Cup 2025, logrando su título número 48.", category: "club", team: "Inter Miami CF" },
  { id: "m14", year: 2026, title: "Último Preparativo Mundialista", description: "Anota su gol 116 en la victoria 5-0 frente a Zambia en La Bombonera en marzo de 2026, encarando la defensa del título en el Mundial 2026.", category: "national", team: "Selección de Argentina" }
];

export const keyRecords: RecordItem[] = [
  { id: "r1", title: "Balones de Oro", description: "Máximo ganador de Balones de Oro en la historia del fútbol.", scope: "world", value: "8 Balones de Oro" },
  { id: "r2", title: "Goles en un Año Natural", description: "Más goles anotados en un solo año natural (club y selección).", scope: "world", value: "91 goles (2012)" },
  { id: "r3", title: "Goles en un Club", description: "Más goles oficiales anotados para un solo club (FC Barcelona).", scope: "club", value: "672 goles" },
  { id: "r4", title: "Goles en La Liga", description: "Máximo goleador histórico de la Liga Española.", scope: "europe", value: "474 goles" },
  { id: "r5", title: "Títulos Totales", description: "Futbolista con más títulos oficiales colectivos ganados en la historia.", scope: "world", value: "48 títulos mayores" },
  { id: "r6", title: "Goles en Selección Argentina", description: "Máximo goleador histórico de la selección albiceleste.", scope: "country", value: "116 goles" },
  { id: "r7", title: "Asistencias Internacionales", description: "Máximo asistidor en la historia de las selecciones masculinas de fútbol.", scope: "world", value: "61 asistencias" },
  { id: "r8", title: "Mundial Balón de Oro", description: "Único jugador galardonado dos veces con el Balón de Oro del Mundial de la FIFA.", scope: "world", value: "2 (2014, 2022)" }
];

export const triviaQuestions: TriviaQuestion[] = [
  {
    id: "q1",
    question: "¿En qué año natural Lionel Messi estableció el récord histórico de 91 goles oficiales?",
    options: ["2011", "2012", "2013", "2015"],
    correctAnswer: 1,
    explanation: "Messi marcó 91 goles oficiales en el año 2012 (79 con el Barcelona y 12 con la selección argentina), superando el récord anterior de 85 de Gerd Müller en 1972."
  },
  {
    id: "q2",
    question: "¿Contra qué club anotó Messi su primer gol oficial con el primer equipo del FC Barcelona?",
    options: ["Real Madrid", "Getafe", "Albacete", "Espanyol"],
    correctAnswer: 2,
    explanation: "Messi marcó su primer gol oficial el 1 de mayo de 2005 frente al Albacete en el Camp Nou, tras recibir una asistencia sutil de Ronaldinho de vaselina."
  },
  {
    id: "q3",
    question: "¿Cuántos Balones de Oro ha ganado Lionel Messi a lo largo de su carrera?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 3,
    explanation: "Messi ha ganado un récord histórico de 8 Balones de Oro en los años 2009, 2010, 2011, 2012, 2015, 2019, 2021 y 2023."
  },
  {
    id: "q4",
    question: "¿Contra qué selección debutó Messi en la selección mayor de Argentina, partido en el que fue expulsado a los 43 segundos?",
    options: ["Hungría", "Alemania", "Paraguay", "Brasil"],
    correctAnswer: 0,
    explanation: "Messi debutó contra Hungría el 17 de agosto de 2005. Entró en la segunda mitad y recibió una tarjeta roja directa a los 43 segundos tras intentar liberarse de un agarrón de un defensor."
  },
  {
    id: "q5",
    question: "¿Cuántos títulos oficiales en total tiene Lionel Messi en su palmarés mayor al culminar el año 2025 con el Inter Miami?",
    options: ["38 títulos", "41 títulos", "45 títulos", "48 títulos"],
    correctAnswer: 3,
    explanation: "Al ganar la MLS Cup en diciembre de 2025 con el Inter Miami CF, Messi alcanzó la histórica marca de 48 títulos oficiales colectivos en su carrera, el mayor registro de todos los tiempos."
  },
  {
    id: "q6",
    question: "¿En qué videojuego shooter militar se incluyó a Lionel Messi como operador jugable con su propia skin y voces en 2022?",
    options: ["Fortnite", "Call of Duty: Modern Warfare II", "Free Fire", "Apex Legends"],
    correctAnswer: 1,
    explanation: "Lionel Messi fue añadido como operador jugable en Call of Duty: Modern Warfare II y Warzone 2.0 en noviembre de 2022 como parte de un evento especial del Mundial de Catar."
  },
  {
    id: "q7",
    question: "En 2023, Lionel Messi se unió como copropietario de un famoso equipo de esports fundado por Sergio Agüero. ¿Cómo se llama esta organización?",
    options: ["KRÜ Esports", "9z Team", "Isurus Gaming", "KOI"],
    correctAnswer: 0,
    explanation: "Messi se unió a su gran amigo Sergio 'Kun' Agüero como socio y copropietario de KRÜ Esports, organización argentina que compite a nivel mundial en videojuegos como VALORANT y Rocket League."
  },
  {
    id: "q8",
    question: "¿En qué edición de la mítica saga de fútbol de EA Sports apareció Lionel Messi por primera vez de forma exclusiva en la portada global?",
    options: ["FIFA 10", "FIFA 12", "FIFA 13", "FIFA 14"],
    correctAnswer: 2,
    explanation: "Messi apareció por primera vez en la portada global exclusiva en FIFA 13 tras firmar un contrato multi-anual con EA Sports (anteriormente había aparecido en portadas de Pro Evolution Soccer)."
  },
  {
    id: "q9",
    question: "¿Cuál ha sido la valoración base (rating) más alta alcanzada por Lionel Messi en el videojuego FIFA Ultimate Team?",
    options: ["92", "93", "94", "95"],
    correctAnswer: 2,
    explanation: "La valoración base más alta de Messi en la historia de la franquicia FIFA de EA fue un rating de 94, alcanzado en múltiples ediciones (FIFA 12 a FIFA 16, FIFA 19 y FIFA 20)."
  },
  {
    id: "q10",
    question: "¿Con qué compañía de videojuegos firmó Messi para ser la portada y embajador principal de la saga PES (eFootball)?",
    options: ["Electronic Arts", "Konami", "Ubisoft", "SEGA"],
    correctAnswer: 1,
    explanation: "Messi ha tenido una larga alianza con Konami, siendo la cara de múltiples ediciones de Pro Evolution Soccer y de su evolución free-to-play eFootball."
  },
  {
    id: "q11",
    question: "¿En qué popular videojuego Battle Royale de móviles se lanzó una colaboración oficial con Messi que incluía trajes dorados y eventos de juego en 2022?",
    options: ["PUBG Mobile", "Free Fire", "Garena Arena", "Brawl Stars"],
    correctAnswer: 0,
    explanation: "PUBG Mobile lanzó una colaboración exclusiva con Lionel Messi en noviembre de 2022, introduciendo skins de Messi, ítems temáticos y minijuegos de fútbol dentro del mapa."
  },
  {
    id: "q12",
    question: "¿En qué edición apareció Messi por última vez en una portada global del videojuego FIFA antes de pasar a la competencia (eFootball/Konami)?",
    options: ["FIFA 15", "FIFA 16", "FIFA 17", "FIFA 18"],
    correctAnswer: 1,
    explanation: "La portada de FIFA 16 fue la última vez que Messi ilustró globalmente la saga de EA Sports, tras lo cual EA firmó con Marco Reus (FIFA 17) y Cristiano Ronaldo (FIFA 18)."
  },
  {
    id: "q13",
    question: "¿Qué dorsal utilizó Lionel Messi en su debut oficial en la primera división con el FC Barcelona contra el Espanyol?",
    options: ["10", "19", "30", "18"],
    correctAnswer: 2,
    explanation: "Messi debutó en Primera División el 16 de octubre de 2004 portando el dorsal 30, ya que las fichas del primer equipo (dorsales 1 al 25) estaban ocupadas."
  },
  {
    id: "q14",
    question: "¿Quién asistió a Messi con un centro milimétrico en su icónico gol de cabeza al Manchester United en la final de la Champions League 2009?",
    options: ["Andrés Iniesta", "Xavi Hernández", "Samuel Eto'o", "Thierry Henry"],
    correctAnswer: 1,
    explanation: "Xavi Hernández metió un centro preciso al segundo palo que Messi conectó de cabeza bombeado por encima de Edwin van der Sar para sentenciar la final (2-0)."
  },
  {
    id: "q15",
    question: "¿A qué arquero le anotó Messi su gol número 644 con el Barcelona, rompiendo el récord histórico de Pelé como máximo goleador en un solo club?",
    options: ["Jan Oblak", "Iker Casillas", "Manuel Neuer", "Marc-André ter Stegen"],
    correctAnswer: 0,
    explanation: "Le marcó el gol 644 a Jan Oblak del Atlético de Madrid en diciembre de 2020. Para celebrarlo, Budweiser envió botellas personalizadas y numeradas a todos los arqueros que recibieron goles de Messi."
  },
  {
    id: "q16",
    question: "¿En qué club infantil de Rosario dio Messi sus primeros pasos como futbolista amateur antes de incorporarse a Newell's Old Boys?",
    options: ["Central Córdoba", "Abanderado Grandoli", "Tiro Federal", "Renato Cesarini"],
    correctAnswer: 1,
    explanation: "Messi comenzó a jugar a los 4 años en el club Abanderado Grandoli de su barrio en Rosario, dirigido por Salvador Aparicio, impulsado por su abuela Celia."
  },
  {
    id: "q17",
    question: "¿Contra qué selección nacional marcó Lionel Messi su primer gol oficial en una Copa del Mundo de la FIFA (Alemania 2006)?",
    options: ["Costa de Marfil", "Países Bajos", "Serbia y Montenegro", "México"],
    correctAnswer: 2,
    explanation: "Habiendo ingresado como suplente en la fase de grupos frente a Serbia y Montenegro, Messi anotó el sexto gol en la histórica goleada 6-0 de Argentina."
  },
  {
    id: "q18",
    question: "¿En qué estadio histórico levantó Lionel Messi su primer título con la selección mayor argentina en la Copa América 2021?",
    options: ["Estadio Monumental", "Estadio Maracaná", "Estadio Centenario", "Estadio Mané Garrincha"],
    correctAnswer: 1,
    explanation: "Argentina venció a Brasil 1-0 en la gran final de la Copa América el 10 de julio de 2021 en el mismísimo e histórico Estadio Maracaná en Río de Janeiro."
  },
  {
    id: "q19",
    question: "¿Qué distinción individual recibió Messi al finalizar el Mundial de Catar 2022 tras coronarse campeón?",
    options: ["Bota de Oro", "Guante de Oro", "Balón de Oro del Mundial", "Premio Fair Play"],
    correctAnswer: 2,
    explanation: "Messi fue galardonado con el Balón de Oro del Mundial (MVP), convirtiéndose en el primer futbolista en la historia en ganar este premio dos veces (2014 y 2022)."
  },
  {
    id: "q20",
    question: "¿Qué director técnico de prestigio mundial hizo debutar a Lionel Messi en un partido oficial con el F.C. Barcelona?",
    options: ["Pep Guardiola", "Frank Rijkaard", "Louis van Gaal", "Ronald Koeman"],
    correctAnswer: 1,
    explanation: "El neerlandés Frank Rijkaard lo promovió del Barcelona B y lo hizo debutar oficialmente en octubre de 2004 en el clásico de la ciudad catalana."
  },
  {
    id: "q21",
    question: "¿Qué streamer español unió fuerzas con Sergio Agüero en Twitch en la transmisión en vivo donde Messi anunció que se convertía en copropietario de KRÜ?",
    options: ["Ibai Llanos", "TheGrefg", "Rubius", "Aurplay"],
    correctAnswer: 0,
    explanation: "Ibai Llanos copresentó la transmisión histórica de KRÜ en Twitch, sumando millones de espectadores simultáneos cuando se anunció la incorporación societaria de Messi."
  }
];
