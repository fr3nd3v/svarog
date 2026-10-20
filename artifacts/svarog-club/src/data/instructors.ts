export type InstructorProfile = {
  id: string;
  name: string;
  role: string;
  discipline: string;
  introduction: string;
  experience: string;
  /**
   * Add an image at public/instructors/<filename>.webp and set this to
   * "instructors/<filename>.webp". The carousel adds the app base path.
   */
  photo?: string;
  photoAlt?: string;
};

export const instructors: InstructorProfile[] = [
  {
    id: 'archery',
    name: 'Имя наставника уточняется',
    role: 'Наставник по стрельбе из лука и арбалета',
    discipline: 'ЛУК И АРБАЛЕТ',
    introduction: 'Поможет освоить технику стрельбы и безопасную работу со снаряжением.',
    experience: 'Стаж метания — более 3 лет.',
  },
  {
    id: 'throwing',
    name: 'Имя наставника уточняется',
    role: 'Инструктор по метанию ножей и топоров',
    discipline: 'МЕТАНИЕ',
    introduction: 'Объяснит механику броска и поможет начать с базовых упражнений.',
    experience: 'Стаж метания — более 3 лет.',
  },
  {
    id: 'sword',
    name: 'Имя наставника уточняется',
    role: 'Тренер по фехтованию на мягком оружии',
    discipline: 'МЕЧЕВОЙ БОЙ',
    introduction: 'Покажет базовые действия и правила безопасного боя.',
    experience: 'Стаж метания — более 3 лет.',
  },
];
