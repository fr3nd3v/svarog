import { ErrorBoundary } from "@/components/error-boundary";
import InstructorCarousel from "@/components/instructor-carousel";
import SvarogPricing from "@/components/svarog-pricing";
import {
  CLUB_PHONE_HREF,
  CLUB_PHONE_LABEL,
  CLUB_VK_LABEL,
  CLUB_VK_URL,
} from "@/lib/club-contact";
import { publicAssetUrl } from "@/lib/public-asset-url";
import NotFound from "@/pages/not-found";
import {
  ArrowDown,
  ArrowRight,
  Axe,
  BowArrow,
  Check,
  ChevronDown,
  Compass,
  Menu,
  MessageCircle,
  MoveUpRight,
  Phone,
  Shield,
  Sparkles,
  Swords,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import "./svarog.css";

const svarogLogo = publicAssetUrl("svarog-star-red.webp");
const heroImage = publicAssetUrl("svarog-hero.webp");

type Direction = {
  id: string;
  number: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
  features: string[];
};
const directions: Direction[] = [
  {
    id: "bow",
    number: "01",
    icon: BowArrow,
    title: "Стрельба из лука и арбалета",
    subtitle: "Тишина. Натяжение. Выстрел.",
    description: "Меткость, концентрация, традиционные и современные луки.",
    detail:
      "Начинаем с безопасной стойки и короткой дистанции. Тренер поможет подобрать хват, натяжение и ритм — а потом мишень начнёт отвечать на каждое движение.",
    features: [
      "Подходит новичкам",
      "Инструктаж и снаряжение клуба",
      "Можно прийти одному или компанией",
    ],
  },
  {
    id: "throw",
    number: "03",
    icon: Axe,
    title: "Метание ножей и топоров",
    subtitle: "Попади в характер.",
    description: "Ножи и топоры. Перезагрузка, требующая внимания и точности.",
    detail:
      "Разберём механику броска с нуля: положение корпуса, дистанцию и безопасный выпуск. Начинаем с простых упражнений — никакого опыта не требуется.",
    features: [
      "Пошаговое обучение",
      "Снаряжение клуба",
      "Только по правилам инструктора",
    ],
  },
  {
    id: "combat",
    number: "04",
    icon: Swords,
    title: "СМБ · современный мечевой бой",
    subtitle: "Сражение без синяков.",
    description:
      "Безопасное фехтование на мягком оружии с защитной экипировкой.",
    detail:
      "Пробуй исторический фехтовальный азарт в мягком безопасном формате. Тренер покажет базовые действия и правила, экипировка предоставляется клубом.",
    features: [
      "Мягкое безопасное оружие",
      "Защитная экипировка клуба",
      "Формат для начинающих",
    ],
  },
];

function DirectionDialog({
  selected,
  close,
  choose,
}: {
  selected: Direction | null;
  close: () => void;
  choose: () => void;
}) {
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close]);
  if (!selected) return null;
  const Icon = selected.icon;
  return (
    <div
      className="direction-dialog"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section
        className="direction-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="direction-dialog-title"
      >
        <button
          className="direction-dialog__close"
          aria-label="Закрыть"
          onClick={close}
        >
          <X size={20} />
        </button>
        <span className="direction-dialog__icon">
          <Icon size={25} />
        </span>
        <span className="eyebrow">НАПРАВЛЕНИЕ {selected.number}</span>
        <h2 id="direction-dialog-title" className="section__title">
          {selected.title}
        </h2>
        <p className="direction-dialog__detail">{selected.detail}</p>
        <div className="direction-dialog__points">
          {selected.features.map((item) => (
            <div key={item}>
              <Check size={15} />
              {item}
            </div>
          ))}
        </div>
        <button className="button--primary" onClick={choose}>
          Выбрать и записаться <ArrowRight size={17} />
        </button>
      </section>
    </div>
  );
}

function AppContent() {
  const [chosen, setChosen] = useState<Direction | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroActionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const nodes = document.querySelectorAll(".reveal--on-scroll");
    document.documentElement.classList.add("page--motion-ready");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("page--motion-ready");
    };
  }, []);
  useEffect(() => {
    const target = heroActionsRef.current;
    if (!target || !("IntersectionObserver" in window)) return;
    const media = window.matchMedia("(max-width: 760px)");
    let observer: IntersectionObserver | null = null;
    const watch = () => {
      observer?.disconnect();
      observer = null;
      if (!media.matches) {
        setStickyVisible(false);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setStickyVisible(!entry.isIntersecting),
        { threshold: 0 },
      );
      observer.observe(target);
    };
    watch();
    media.addEventListener("change", watch);
    return () => {
      media.removeEventListener("change", watch);
      observer?.disconnect();
    };
  }, []);
  const goForm = () => {
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
    setChosen(null);
    setMobileOpen(false);
  };
  return (
    <div className="site">
      <header className="header">
        <div className="wrap header__inner">
          <a href="#top" className="brand" aria-label="Сварог — наверх">
            <span className="brand__mark">
              <img src={svarogLogo} alt="" width="40" height="40" />
            </span>
            <span className="brand__name">
              СВАРОГ<small>КЛУБ ЖИВОЙ ИСТОРИИ</small>
            </span>
          </a>
          <nav className="header__nav" aria-label="Главная навигация">
            <a className="header__link" href="#directions">
              Направления
            </a>
            <a className="header__link" href="#first-visit">
              Первый визит
            </a>
            <a className="header__link" href="#events">
              События
            </a>
            <a className="header__link" href="#team-building">
              Командам
            </a>
            <a className="header__link" href="#partners">
              Партнёры
            </a>
            <a className="header__link" href="#services">
              Услуги
            </a>
            <a className="header__link" href="#prices">
              Цены
            </a>
            <a className="header__link" href="#contacts">
              Контакты
            </a>
          </nav>
          <a className="header__cta" href="#signup">
            Попробовать <ArrowRight size={15} />
          </a>
          <button
            className="header__menu"
            data-testid="button-mobile-menu"
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="header__drawer" aria-label="Мобильная навигация">
            {[
              ["Направления", "#directions"],
              ["Первый визит", "#first-visit"],
              ["События", "#events"],
              ["Командам", "#team-building"],
              ["Нам доверяют", "#partners"],
              ["Услуги", "#services"],
              ["Цены", "#prices"],
              ["Контакты", "#contacts"],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)}>
                {label}
                <ArrowRight size={15} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__image">
            <img
              src={heroImage}
              alt=""
              width={1024}
              height={1024}
              fetchPriority="high"
            />
          </div>
          <div className="hero__shade" />
          <div className="hero__rune" aria-hidden="true">
            ᛊ
          </div>
          <div className="wrap hero__content">
            <div className="hero__copy reveal">
              <div className="hero__overline">
                <span className="hero__mark" /> ИСТОРИЯ, КОТОРУЮ МОЖНО ПРОЖИТЬ
              </div>
              <div className="hero__crest">
                <span className="hero__crest-line" />
                <span className="hero__crest-text">С В А Р О Г</span>
                <span className="hero__crest-line" />
              </div>
              <h1 className="font-display">
                Клуб живой истории
                <br />и оружия <em>Сварог.</em>
                <br />
                <span>
                  Почувствуй дух приключений
                  <br />в клубе «Сварог».
                </span>
              </h1>
              <p className="hero__description">
                Лук и арбалет, метание, безопасный бой на мягких мечах. Первый
                раз? Именно с этого и начинается путь.
              </p>
              <div className="hero__actions" ref={heroActionsRef}>
                <a className="button--primary" href="#signup">
                  Записаться на пробное <ArrowRight size={17} />
                </a>
                <a className="button--ghost" href="#directions">
                  Выбрать направление <ArrowDown size={15} />
                </a>
              </div>
              <div className="hero__note">
                <Shield size={15} /> Начинающим рады. Снаряжение и вводный
                инструктаж — в клубе.
              </div>
            </div>
            <div className="hero__seal" aria-label="Сварог — клуб приключений">
              <Sparkles className="hero__star" size={20} />
              <span>
                ВОЙДИ
                <br />В ЛЕГЕНДУ
              </span>
              <small>С · Ж · И</small>
            </div>
            <div className="hero__bottom">
              <span>КЛУБ ЖИВОЙ ИСТОРИИ</span>
              <span>01 / ПЕРВЫЙ ШАГ</span>
            </div>
          </div>
        </section>

        <section className="intro">
          <div className="wrap intro__grid">
            <div className="intro__title">
              <span className="eyebrow">НЕ НУЖНО БЫТЬ ГЕРОЕМ</span>
              <h2 className="font-serif">
                Достаточно
                <br />
                прийти.
              </h2>
            </div>
            <p>
              Мы создали пространство, где можно попробовать новое без
              подготовки и специальной формы. Тренер встретит, покажет основы и
              поможет выбрать темп — от первой стрелы или арбалетного выстрела
              до дружеского поединка.
            </p>
            <div className="intro__stats">
              <div>
                <strong>3</strong>
                <span>направления</span>
              </div>
              <i />
              <div>
                <strong>0</strong>
                <span>опыта нужно</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--directions" id="directions">
          <div className="wrap">
            <div className="section__head reveal--on-scroll">
              <div>
                <span className="eyebrow">ВЫБЕРИ СВОЙ ПУТЬ · 01—04</span>
                <h2 className="section__title">
                  Три способа
                  <br />
                  выйти из привычного.
                </h2>
              </div>
              <p className="section__aside">
                Лук и арбалет — два самостоятельных направления. Везде можно
                начать с нуля; наличие снаряжения и условия уточняются у клуба.
              </p>
            </div>
            <div className="directions__list">
              {directions.map((d, i) => {
                const Icon = d.icon;
                return (
                  <button
                    className={`direction-card card reveal--on-scroll direction-card--${i + 1}`}
                    key={d.id}
                    data-testid={`card-direction-${d.id}`}
                    onClick={() => setChosen(d)}
                  >
                    <div className="direction-card__top">
                      <span>{d.number} / ПУТЬ</span>
                      <MoveUpRight size={17} />
                    </div>
                    <div className="direction-card__art">
                      <div
                        className={`direction-card__symbol direction-card__symbol--${d.id}`}
                      >
                        <Icon size={55} strokeWidth={1.15} />
                      </div>
                      <span className="direction-card__coordinate">
                        {d.id === "bow"
                          ? "01 / ЛУК"
                          : d.id === "crossbow"
                            ? "02 / АРБАЛЕТ"
                            : d.id === "throw"
                              ? "03 / МЕТАНИЕ"
                              : "04 / ПОЕДИНОК"}
                      </span>
                    </div>
                    <div className="direction-card__copy">
                      <span className="eyebrow">{d.subtitle}</span>
                      <h3 className="font-serif">{d.title}</h3>
                      <p>{d.description}</p>
                      <span className="direction-card__more">
                        Узнать больше <ArrowRight size={14} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section--visit" id="first-visit">
          <div className="wrap visit__layout">
            <div className="visit__intro reveal--on-scroll">
              <span className="eyebrow">КВЕСТ ДЛЯ НОВИЧКА · УРОВЕНЬ 01</span>
              <h2 className="section__title">
                Первый визит —<br />
                <i>без сюрпризов.</i>
              </h2>
              <p>
                Четыре простых шага. Никаких проверок на «своего» — только
                любопытство и желание попробовать.
              </p>
              <a className="action-link" href="#signup">
                Забронировать первое приключение <ArrowRight size={15} />
              </a>
            </div>
            <div className="visit__steps">
              {[
                [
                  "01",
                  "Оставь заявку",
                  "Выбери направление — мы уточним детали и время.",
                ],
                [
                  "02",
                  "Приходи как есть",
                  "Удобная спортивная одежда — всё снаряжение мы выдадим.",
                ],
                [
                  "03",
                  "Слушай инструктора",
                  "Опытный мастер объяснит основы безопасности и техники.",
                ],
                [
                  "04",
                  "Попробуй сам",
                  "Сделаешь первые выстрелы, броски или проведёшь первый бой.",
                ],
              ].map(([n, t, d], i) => (
                <div
                  className="visit__step reveal--on-scroll"
                  style={{ transitionDelay: `${i * 90}ms` }}
                  key={n}
                >
                  <span className="visit__number">{n}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                  <span className="visit__state">
                    {i === 0 ? <Compass size={17} /> : <ArrowRight size={17} />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="event" id="events">
          <div className="event__art" aria-hidden="true" />
          <div className="wrap event__content reveal--on-scroll">
            <div className="event__tag">
              <Sparkles size={15} /> АФИША
            </div>
            <span className="eyebrow">СЕЙЧАС</span>
            <h2 className="font-display">
              Пока
              <br />
              <span>событий нет</span>
            </h2>
            <p>
              Ближайшие турниры и праздники появятся здесь. Пока связаться с
              клубом можно по телефону или в группе ВКонтакте.
            </p>
            <div className="event__links">
              <a href={CLUB_PHONE_HREF}>
                <Phone size={17} />
                {CLUB_PHONE_LABEL}
              </a>
              <a href={CLUB_VK_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={17} />
                Связаться по VK
              </a>
            </div>
          </div>
          <div className="event__side">ОСОБЫЕ СОБЫТИЯ · СКОРО</div>
        </section>

        <section className="section section--gatherings">
          <div className="wrap gatherings__layout">
            <div className="gatherings__title reveal--on-scroll">
              <span className="eyebrow">СОБЕРИТЕ СВОЮ ГРУППУ</span>
              <h2 className="section__title">
                Есть повод.
                <br />
                Есть Сварог.
              </h2>
              <p>
                Живой формат для тех, кому хочется не просто посидеть за столом.
              </p>
              <a className="button--primary" href="#signup">
                Обсудить ваш формат <ArrowRight size={16} />
              </a>
            </div>
            <div className="gatherings__list">
              {[
                [
                  "День рождения в стиле D&D",
                  "Праздник, где каждый попробует новое и унесёт свою историю.",
                ],
                [
                  "Командам",
                  "Корпоративный формат с инструктажем, активностями и общим азартом.",
                ],
                [
                  "Для двоих",
                  "Необычное свидание: поддержать, посоревноваться, запомнить.",
                ],
                [
                  "Аренда клуба",
                  "Закрытый формат для вашей компании — детали и доступность уточняйте.",
                ],
              ].map(([title, desc], i) => (
                <article
                  className="gatherings__item reveal--on-scroll"
                  key={title}
                >
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                  <ArrowRight size={17} />
                </article>
              ))}
            </div>
          </div>
          <div
            id="team-building"
            className="wrap gatherings__offer reveal--on-scroll"
          >
            <div className="gatherings__mark">ДЛЯ КОМАНД</div>
            <div>
              <span className="eyebrow">
                НЕ ГОТОВЫЙ СЦЕНАРИЙ, А ТОЧНОЕ ПОПАДАНИЕ
              </span>
              <h3>Сначала разбираемся в задаче.</h3>
              <p>
                Начинаем с диагностики сложностей бизнеса и команды. Затем
                подбираем иммерсивную игру и метательные активности под ваш
                запрос — чтобы коллеги стали ближе и вместе проработали
                актуальные организационные проблемы.
              </p>
            </div>
            <a className="action-link" href="#signup">
              Обсудить задачу <ArrowRight size={15} />
            </a>
          </div>
        </section>

        <section className="section section--capital">
          <div className="wrap capital__layout reveal--on-scroll">
            <div>
              <span className="eyebrow">СВОЯ ШКОЛА · СВОЙ ХАРАКТЕР</span>
              <h2 className="font-display">
                Столица
                <br />
                <em>
                  Нестандартного
                  <br />
                  Метания
                </em>
              </h2>
            </div>
            <div className="capital__copy">
              <span className="capital__index">ТАТАРСТАН · И ДАЛЬШЕ</span>
              <p>
                Сварог — пионеры и родоначальники многих необычных упражнений в
                метании, а также ролевых и метательных событий в Татарстане и за
                его пределами.
              </p>
              <p>
                Здесь привычное упражнение может стать частью истории: с
                правилами, сюжетом и азартом, который объединяет людей.
              </p>
              <a className="action-link" href="#events">
                Смотреть события <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <section className="section section--rental" id="services">
          <div className="wrap rental__layout">
            <div className="rental__art reveal--on-scroll">
              <span className="rental__rune" aria-hidden="true">
                ᛊ
              </span>
              <span className="rental__label">
                ИСТОРИЧЕСКИЙ ОБРАЗ · В АРЕНДУ
              </span>
            </div>
            <div className="rental__copy reveal--on-scroll">
              <span className="eyebrow">ПРЕДМЕТЫ С ИСТОРИЕЙ</span>
              <h2 className="section__title">
                Средневековый
                <br />
                образ — напрокат.
              </h2>
              <p>
                В клубе можно арендовать историческую одежду и снаряжение: мечи,
                кольчуги, луки и другие предметы. Наличие и условия аренды
                уточняются у команды.
              </p>
              <p>
                Снаряжение уже предоставляли для короткометражных фильмов,
                рекламных роликов и тематических мероприятий барбершопов.
              </p>
              <a className="button--ghost" href="#signup">
                Уточнить наличие <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="section section--partners" id="partners">
          <div className="wrap">
            <div className="section__head reveal--on-scroll">
              <div>
                <span className="eyebrow">СОВМЕСТНЫЕ СОБЫТИЯ И ПРОЕКТЫ</span>
                <h2 className="section__title">Нам доверяют</h2>
              </div>
              <p className="section__aside">
                Бренды и события, с которыми клуб работал. Типографические
                подписи — не официальные логотипы.
              </p>
            </div>
            <div className="partners__grid reveal--on-scroll">
              {[
                "Т-Банк",
                "Татнефть",
                "Фестиваль Каракуз",
                "И другие партнёры",
              ].map((name, i) => (
                <div
                  className={`partners__name partners__name--${i + 1}`}
                  key={name}
                >
                  <span>{name}</span>
                  {i === 3 && <small>РАЗНЫЕ КОМАНДЫ И СОБЫТИЯ</small>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <SvarogPricing />

        <section className="section section--trainers">
          <div className="wrap">
            <div className="section__head reveal--on-scroll">
              <div>
                <span className="eyebrow">ЛЮДИ, КОТОРЫЕ ВСТРЕТЯТ</span>
                <h2 className="section__title">
                  Наставники
                  <br />
                  вашего первого шага.
                </h2>
              </div>
            </div>
            <InstructorCarousel />
            <p className="trainers__proof">
              От первого броска до мастерства — каждый путь начинается с наставника.
            </p>
          </div>
        </section>

        <section className="signup" id="signup">
          <div className="signup__flare" />
          <div className="wrap signup__layout">
            <div className="signup__copy reveal--on-scroll">
              <span className="eyebrow">ТВОЯ ИСТОРИЯ НАЧИНАЕТСЯ ЗДЕСЬ</span>
              <h2 className="font-display">
                Не наблюдай
                <br />
                за приключением.
                <br />
                <em>Войди в него.</em>
              </h2>
              <p>
                Для записи напишите в группу ВКонтакте или позвоните. Ответим и
                подскажем, с чего начать.
              </p>
              <div className="signup__promise">
                <Shield size={19} />
                <span>
                  Никакого опыта не требуется.
                  <br />
                  <b>Экипировка будет ждать.</b>
                </span>
              </div>
              <div className="signup__links">
                <a href={CLUB_VK_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={17} />
                  Написать в VK
                </a>
                <a href={CLUB_PHONE_HREF}>
                  <Phone size={17} />
                  {CLUB_PHONE_LABEL}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--location" id="contacts">
          <div className="wrap location__layout">
            <div className="location__copy reveal--on-scroll">
              <span className="eyebrow">ПРИХОДИ К НАМ</span>
              <h2 className="section__title">
                Клуб «Сварог»
                <br />
                на карте 2ГИС.
              </h2>
              <p>
                Откройте карту ниже, чтобы посмотреть расположение клуба.
                Уточнить маршрут, расписание и условия можно по телефону или в
                группе ВКонтакте.
              </p>
              <div className="location__contacts">
                <div>
                  <span>ТЕЛЕФОН</span>
                  <a href={CLUB_PHONE_HREF} data-testid="link-club-phone">
                    {CLUB_PHONE_LABEL}
                  </a>
                </div>
                <div>
                  <span>ГРУППА ВКОНТАКТЕ</span>
                  <a
                    href={CLUB_VK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-club-vk"
                  >
                    {CLUB_VK_LABEL}
                  </a>
                </div>
              </div>
              <a
                className="button--ghost"
                href={CLUB_VK_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Задать вопрос в VK <ArrowRight size={16} />
              </a>
            </div>

            <div className="location__map reveal--on-scroll">
              <iframe
                id="map_551189963"
                width="100%"
                height="600px"
                title="Клуб «Сварог» на карте 2ГИС"
                loading="lazy"
                src="https://makemap.2gis.ru/widget?data=eJxFUl2PojAU_S_dxzGTUgHRZB4cdAAHEFlnkG7mgY8uVAslUD_AzH_fqrvZNn2555x7T3PPFfA2Jy3JLcIrIlpKOjD7dQWibwiYgTeSiGNLwAg0LW9IK-74FWSc8VbiPyAylN9I4oIKdlPAd3vTCfMM48XmJMxBQjnpspY2gvJaEgJ7_hRYyyKxVwzvIU3sEGa2p7u90WPEBrdeKS7SyrjyOY4uR_JzWuPIOPnD_Owtbm959veZ5i0cdb2NqWOHZVblLF9AukOrLo601qGvQ26zDm8hxRYbMutSki0vkkjr5GNutOpS5Lfr_vUcR-FB1uo1nauZXRTeFp_Joivi6m2foLxPx59HbCr7FF1O2Z4XzvChxJUjfUgOmnbp2NEd06_w_cYTx8KntN6IHH02GJVwTV-p1B7kLIh3JXSjkEldH-_CJkWq7ljaKa0-pG51yqqQZVTppacm33m6swjvXnA1PeamUsWR0qT2QXdsv0xrT2Tos0-i_zMzxHQs_-lt7zoaCJPA2N0chTWH8SkshOU5vtk7C3dzmJoxfF8aLlo-Beb0HBQvL3JZg1Pn5AJmCvx3vkegeISjv63-bzICTmsh-RmXAaJ1Iu7B0dCzqqoI6iNNe56ohq4oX1JPczBDcGp8f41AlTQB7-gjDVfAEgFmD7KmQlVTJvpYMUaA3eBHO2iohoEmY_3WFwycV9KeIdvKWHHGopIQhu9V0R7J9x8Doeo-"
                sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap footer__inner">
          <a href="#top" className="brand" aria-label="Сварог — наверх">
            <span className="brand__mark">
              <img src={svarogLogo} alt="" width="40" height="40" />
            </span>
            <span className="brand__name">
              СВАРОГ<small>КЛУБ ЖИВОЙ ИСТОРИИ</small>
            </span>
          </a>
          <p>
            Живая история. Настоящий азарт.
            <br />И место для первого шага.
          </p>
          <div className="footer__contacts">
            <a href={CLUB_PHONE_HREF}>{CLUB_PHONE_LABEL}</a>
            <a href={CLUB_VK_URL} target="_blank" rel="noopener noreferrer">
              Группа ВКонтакте
            </a>
          </div>
          <a className="footer__top" href="#top">
            Наверх <ChevronDown size={15} />
          </a>
        </div>
        <div className="wrap footer__bottom">
          <span>© КЛУБ ЖИВОЙ ИСТОРИИ «СВАРОГ»</span>
          <a href={CLUB_VK_URL} target="_blank" rel="noopener noreferrer">
            Группа ВКонтакте <ArrowRight size={13} />
          </a>
        </div>
      </footer>
      <DirectionDialog
        selected={chosen}
        close={() => setChosen(null)}
        choose={() => goForm()}
      />
      <button
        className={`header__sticky${stickyVisible ? " header__sticky--visible" : ""}`}
        aria-hidden={stickyVisible ? undefined : true}
        tabIndex={stickyVisible ? undefined : -1}
        onClick={() => goForm()}
      >
        Записаться на пробное
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function Home() {
  return <AppContent />;
}
function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
export default App;
