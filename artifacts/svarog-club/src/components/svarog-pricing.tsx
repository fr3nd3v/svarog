import { ArrowRight, Clock3, Phone, Shield } from 'lucide-react';
import { CLUB_PHONE_HREF, CLUB_PHONE_LABEL, CLUB_VK_URL } from '@/lib/club-contact';

type PriceLine = { label: string; value: string };
type PriceCardData = {
  id: string;
  title: string;
  description: string;
  details?: string[];
  prices: PriceLine[];
};

const regularPrograms: PriceCardData[] = [
  {
    id: 'throwing',
    title: 'Метание ножей и топоров',
    description: 'Отточить мастерство или попробовать себя в новом спорте.',
    prices: [{ label: 'Абонемент · 10 занятий', value: '3 500 ₽' }],
  },
  {
    id: 'archery',
    title: 'Стрельба из лука и арбалета',
    description: 'Для новичков и тех, кто хочет улучшить свои навыки.',
    prices: [
      { label: 'Разовое занятие', value: '700 ₽' },
      { label: 'Для работников КАМАЗа', value: '600 ₽' },
      { label: 'Абонемент · 10 занятий', value: '3 500 ₽' },
    ],
  },
  {
    id: 'fencing',
    title: 'Фехтование',
    description: 'Работа с мечом разных эпох и техники мировых школ.',
    prices: [
      { label: 'Разовое занятие', value: '600 ₽' },
      { label: 'Абонемент · 10 занятий', value: '3 500 ₽' },
    ],
  },
];

const groupPrograms: PriceCardData[] = [
  {
    id: 'friends-throwing',
    title: 'Банда друзей · метательная программа',
    description: 'Учимся метать звёздочки, ножи и топоры, затем играем и участвуем в конкурсах.',
    details: ['1 час', 'По предварительной записи: выходные и праздники'],
    prices: [
      { label: 'Группа 2–4 человека', value: '900 ₽ / чел.' },
      { label: 'Группа 5–8 человек', value: '1 000 ₽ / чел.' },
    ],
  },
  {
    id: 'friends-combo',
    title: 'Банда друзей · комбо-отдых',
    description: 'Метание и игры, затем стрельба из лука или арбалета.',
    details: ['1 час метания + 30 минут стрельбы'],
    prices: [
      { label: '1–4 человека · 1,5 часа', value: '1 500 ₽ / чел.' },
      { label: '5–8 человек · 2 часа', value: '1 300 ₽ / чел.' },
    ],
  },
  {
    id: 'family',
    title: 'Семейный отдых',
    description: 'Постановка броска, семейные игры и турнир в зале клуба.',
    details: ['Ножи, топоры и нестандартные снаряды', 'Длительность — 1 час'],
    prices: [
      { label: 'Группа до 4 человек', value: '3 500 ₽' },
      { label: 'Каждый дополнительный участник', value: '+900 ₽ / чел.' },
    ],
  },
];

function PriceCard({ program }: { program: PriceCardData }) {
  return (
    <article className="pricing-card" data-testid={`card-price-${program.id}`}>
      <h4>{program.title}</h4>
      <p className="pricing-card-description">{program.description}</p>
      {program.details && (
        <ul className="pricing-details">
          {program.details.map((detail) => <li key={detail}>{detail}</li>)}
        </ul>
      )}
      <ul className="pricing-lines">
        {program.prices.map((price) => (
          <li key={price.label}>
            <span>{price.label}</span>
            <strong>{price.value}</strong>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function SvarogPricing() {
  return (
    <section className="section prices-section" id="prices">
      <div className="wrap">
        <div className="section-head reveal-on-scroll">
          <div>
            <span className="eyebrow">ЗАНЯТИЯ, КУРСЫ И ОТДЫХ</span>
            <h2 className="section-title">Сколько стоит<br />первый шаг?</h2>
          </div>
          <p className="section-aside">
            Регулярные занятия, обучающие курсы и групповые программы. Цены указаны по условиям клуба;
            расписание и свободные места уточняйте в группе ВКонтакте.
          </p>
        </div>

        <div className="pricing-safety">
          <Shield size={20} aria-hidden="true" />
          <p>Все занятия проходят под руководством опытных инструкторов с полным соблюдением техники безопасности.</p>
        </div>

        <div className="pricing-block">
          <h3 className="pricing-subtitle">Регулярные занятия и абонементы</h3>
          <div className="pricing-grid pricing-grid-regular">
            {regularPrograms.map((program) => <PriceCard key={program.id} program={program} />)}
          </div>
        </div>

        <div className="pricing-block">
          <h3 className="pricing-subtitle">Обучающие курсы</h3>
          <article className="pricing-card pricing-card-course" data-testid="card-price-knife-course">
            <div>
              <span className="pricing-card-label">ИНДИВИДУАЛЬНЫЙ ИНТЕНСИВ</span>
              <h4>Курс по метанию ножей</h4>
              <p className="pricing-card-description">Три занятия: на каждом разбираем отдельную технику.</p>
              <ul className="pricing-details">
                <li>Многооборотная, малооборотная и безоборотная техники</li>
                <li>Длительность — 3 занятия по 1 часу</li>
              </ul>
            </div>
            <strong className="pricing-course-price">2 500 ₽ <small>за курс</small></strong>
          </article>
        </div>

        <div className="pricing-block">
          <h3 className="pricing-subtitle">Групповые программы и отдых</h3>
          <p className="pricing-section-description">
            Формат для дней рождения, корпоративов, семейных встреч и праздников.
          </p>
          <div className="pricing-grid pricing-grid-groups">
            {groupPrograms.map((program) => <PriceCard key={program.id} program={program} />)}
          </div>
        </div>

        <div className="pricing-contact">
          <p>Турниры, сезонные события и другие форматы — в официальной группе клуба.</p>
          <div>
            <a className="btn-primary" href={CLUB_VK_URL} target="_blank" rel="noopener noreferrer">
              Цены и запись в VK <ArrowRight size={17} />
            </a>
            <a className="btn-ghost" href={CLUB_PHONE_HREF}>
              <Phone size={16} /> {CLUB_PHONE_LABEL}
            </a>
          </div>
          <span><Clock3 size={15} /> Перед поездкой уточните расписание и наличие мест.</span>
        </div>
      </div>
    </section>
  );
}
