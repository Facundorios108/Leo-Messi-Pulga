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
  titles: 45
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
  { year: 2025, appearances: 7, goals: 3, assists: 4 },
  { year: 2026, appearances: 1, goals: 1, assists: 1 }
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
  { id: "m13", year: 2025, title: "MLS Cup y Triplete en EE.UU.", description: "Lidera a Inter Miami a ganar el MLS Supporters' Shield y la MLS Cup 2025, logrando su título número 45.", category: "club", team: "Inter Miami CF" },
  { id: "m14", year: 2026, title: "Último Preparativo Mundialista", description: "Anota su gol 116 en la victoria 5-0 frente a Zambia en La Bombonera en marzo de 2026, encarando la defensa del título en el Mundial 2026.", category: "national", team: "Selección de Argentina" }
];

export const keyRecords: RecordItem[] = [
  { id: "r1", title: "Balones de Oro", description: "Máximo ganador de Balones de Oro en la historia del fútbol.", scope: "world", value: "8 Balones de Oro" },
  { id: "r2", title: "Goles en un Año Natural", description: "Más goles anotados en un solo año natural (club y selección).", scope: "world", value: "91 goles (2012)" },
  { id: "r3", title: "Goles en un Club", description: "Más goles oficiales anotados para un solo club (FC Barcelona).", scope: "club", value: "672 goles" },
  { id: "r4", title: "Goles en La Liga", description: "Máximo goleador histórico de la Liga Española.", scope: "europe", value: "474 goles" },
  { id: "r5", title: "Títulos Totales", description: "Futbolista con más títulos oficiales colectivos ganados en la historia.", scope: "world", value: "45 títulos mayores" },
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
    options: ["38 títulos", "41 títulos", "44 títulos", "45 títulos"],
    correctAnswer: 3,
    explanation: "Al ganar la MLS Cup en diciembre de 2025 con el Inter Miami CF, Messi alcanzó la histórica marca de 45 títulos oficiales colectivos en su carrera, el mayor registro de todos los tiempos."
  }
];
