import {
  ArrowDown,
  ArrowRight,
  Axe,
  BowArrow,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  Menu,
  MoveUpRight,
  Shield,
  Sparkles,
  Swords,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import heroImage from "../../../assets/svarog-hero.jpg";
import "./_current.css";
import "./_group.css";

type Direction = {
  id: string;
  number: string;
  icon: typeof BowArrow;
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
    title: "Стрельба из лука",
    subtitle: "Тишина. Натяжение. Выстрел.",
    description: "Меткость, концентрация, традиционные и современные луки.",
    detail:
      "Начинаем с безопасной стойки и короткой дистанции. Тренер поможет подобрать хват, натяжение и ритм — а потом мишень начнёт отвечать на каждое движение.",
    features: [
      "Подходит новичкам",
      "Инструктаж и снаряжение включены",
      "Можно прийти одному или компанией",
    ],
  },
  {
    id: "throw",
    number: "02",
    icon: Axe,
    title: "Метание ножей и топоров",
    subtitle: "Попади в характер.",
    description: "Ножи и топоры. Полная перезагрузка и снятие стресса.",
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
    number: "03",
    icon: Swords,
    title: "СМБ · современный мечевой бой",
    subtitle: "Сражение без синяков.",
    description:
      "Безопасное и динамичное фехтование на мягком оружии. Вся экипировка включена в стоимость!",
    detail:
      "Пробуй исторический фехтовальный азарт в мягком безопасном формате. Тренер покажет базовые действия и правила, экипировка предоставляется клубом.",
    features: [
      "Мягкое безопасное оружие",
      "Защитная экипировка включена в стоимость",
      "Формат для начинающих",
    ],
  },
];

const prices = [
  {
    name: "Пробное посещение",
    note: "Выбери направление и познакомься с клубом",
    price: "Уточнить у клуба",
    tag: "ПЕРВЫЙ ШАГ",
  },
  {
    name: "Абонемент: стрельба из лука",
    note: "Формат и количество занятий уточняются",
    price: "Уточнить у клуба",
  },
  {
    name: "Абонемент: метание",
    note: "Ножи и топоры",
    price: "Уточнить у клуба",
  },
  {
    name: "Абонемент: мечевой бой",
    note: "Мягкое оружие и защитная экипировка",
    price: "Уточнить у клуба",
  },
  {
    name: "Аренда дорожки и снаряжения",
    note: "Наличие и условия — по запросу",
    price: "Уточнить у клуба",
  },
];

function LeadForm({ compact = false }: { compact?: boolean }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [direction, setDirection] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const listener = (event: Event) =>
      setDirection((event as CustomEvent<string>).detail);
    window.addEventListener("svarog-direction", listener);
    return () => window.removeEventListener("svarog-direction", listener);
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("Укажи имя — хотя бы два символа.");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      setError("Проверь номер телефона: нужно не меньше 10 цифр.");
      return;
    }
    if (!direction) {
      setError("Выбери направление, чтобы мы подготовили снаряжение.");
      return;
    }
    setSent(true);
  }

  return sent ? (
    <div className="lead-success" role="status">
      <span className="lead-success__icon">
        <Check size={22} />
      </span>
      <div>
        <strong>Заявка успешно отправлена администратору!</strong>
        <p>
          Это демонстрационная отправка формы. Администратор свяжется с вами
          после подключения формы к клубу.
        </p>
        <button
          className="action-link"
          onClick={() => {
            setSent(false);
            setName("");
            setPhone("");
            setDirection("");
          }}
        >
          Отправить ещё одну заявку
        </button>
      </div>
    </div>
  ) : (
    <form
      onSubmit={submit}
      className={`lead-form ${compact ? "lead-form--compact" : ""}`}
      noValidate
    >
      <label>
        Как к вам обращаться
        <input
          className="field"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ваше имя"
          autoComplete="name"
          required
        />
      </label>
      <label>
        Номер телефона
        <input
          className="field"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+7 (___) ___-__-__"
          type="tel"
          autoComplete="tel"
          required
        />
      </label>
      <label>
        Что попробуем первым?
        <select
          className="field"
          value={direction}
          onChange={(event) => setDirection(event.target.value)}
          required
        >
          <option value="">Выберите направление</option>
          {directions.map((item) => (
            <option key={item.id} value={item.title}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p className="lead-form__error" role="alert">
          {error}
        </p>
      )}
      <button className="button--primary lead-form__submit" type="submit">
        Записаться на пробное <ArrowRight size={17} />
      </button>
      <p className="lead-form__consent">
        Нажимая кнопку, вы отправляете заявку клубу. Контакты и отправка сейчас
        в демонстрационном режиме.
      </p>
    </form>
  );
}

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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
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
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
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

export function Current() {
  const [chosen, setChosen] = useState<Direction | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal--on-scroll");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
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

  const goForm = (direction?: string) => {
    if (direction)
      window.dispatchEvent(
        new CustomEvent("svarog-direction", { detail: direction }),
      );
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
    setChosen(null);
    setMobileOpen(false);
  };

  return (
    <div className="site site--texture">
      <header className="header">
        <div className="wrap header__inner">
          <a href="#top" className="brand" aria-label="Сварог — наверх">
            <span className="brand__mark">
              <span>С</span>
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
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="header__drawer">
            {[
              ["Направления", "#directions"],
              ["Первый визит", "#first-visit"],
              ["События", "#events"],
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
          <div
            className="hero__image"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
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
                  <br />в самом центре города!
                </span>
              </h1>
              <p className="hero__description">
                Лук, метание, мягкий мечевой бой. Первый раз? Именно с этого и
                начинается путь.
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
              <span>ЖИВАЯ ИСТОРИЯ В ГОРОДЕ</span>
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
              поможет выбрать темп — от спокойной первой стрелы до дружеского
              поединка.
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
                <span className="eyebrow">ВЫБЕРИ СВОЙ ПУТЬ · 01—03</span>
                <h2 className="section__title">
                  Три способа
                  <br />
                  выйти из привычного.
                </h2>
              </div>
              <p className="section__aside">
                В каждом направлении можно начать с нуля. Снаряжение
                предоставляется клубом.
              </p>
            </div>
            <div className="directions__list">
              {directions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    className={`direction-card card reveal--on-scroll direction-card--${index + 1}`}
                    key={item.id}
                    onClick={() => setChosen(item)}
                  >
                    <div className="direction-card__top">
                      <span>{item.number} / ПУТЬ</span>
                      <MoveUpRight size={17} />
                    </div>
                    <div className="direction-card__art">
                      <div
                        className={`direction-card__symbol direction-card__symbol--${item.id}`}
                      >
                        <Icon size={55} strokeWidth={1.15} />
                      </div>
                      <span className="direction-card__coordinate">
                        {item.id === "bow"
                          ? "51°30′ N"
                          : item.id === "throw"
                            ? "03 / МЕТАНИЕ"
                            : "02 / ПОЕДИНОК"}
                      </span>
                    </div>
                    <div className="direction-card__copy">
                      <span className="eyebrow">{item.subtitle}</span>
                      <h3 className="font-serif">{item.title}</h3>
                      <p>{item.description}</p>
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
              ].map(([n, title, description], index) => (
                <div
                  className="visit__step reveal--on-scroll"
                  style={{ transitionDelay: `${index * 90}ms` }}
                  key={n}
                >
                  <span className="visit__number">{n}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <span className="visit__state">
                    {index === 0 ? (
                      <Compass size={17} />
                    ) : (
                      <ArrowRight size={17} />
                    )}
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
              <Sparkles size={15} /> ОСОБОЕ СОБЫТИЕ
            </div>
            <span className="eyebrow">ДАТА УТОЧНЯЕТСЯ</span>
            <h2 className="font-display">
              Хэллоуин
              <br />
              <span>в чертогах Сварога</span>
            </h2>
            <p>
              Турнир нечисти, тематические фотозоны и метание топоров в тыквы.
              Костюм не обязателен — настроение приключения уже в программе.
            </p>
            <a className="button--ghost" href="#signup">
              Спросить о событии <ArrowRight size={16} />
            </a>
            <small className="event__note">
              Формат, дата и условия проведения будут объявлены клубом отдельно.
            </small>
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
              ].map(([title, desc], index) => (
                <article
                  className="gatherings__item reveal--on-scroll"
                  key={title}
                >
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                  <ArrowRight size={17} />
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section section--prices" id="prices">
          <div className="wrap">
            <div className="section__head reveal--on-scroll">
              <div>
                <span className="eyebrow">ПОНЯТНЫЕ УСЛОВИЯ</span>
                <h2 className="section__title">
                  Сколько стоит
                  <br />
                  первый шаг?
                </h2>
              </div>
              <p className="section__aside">
                Точные цены клуб не указал — мы не будем придумывать. Напишите
                нам, и администратор подскажет актуальные условия.
              </p>
            </div>
            <div className="price__table reveal--on-scroll">
              {prices.map((item, index) => (
                <div
                  className={`price__row ${index === 0 ? "price__row--featured" : ""}`}
                  key={item.name}
                >
                  <div className="price__name">
                    {item.tag && <span className="price__tag">{item.tag}</span>}
                    <strong>{item.name}</strong>
                    <small>{item.note}</small>
                  </div>
                  <span className="price__value">{item.price}</span>
                  <a
                    href="#signup"
                    aria-label={`Узнать цену: ${item.name}`}
                    className="price__link"
                  >
                    <ArrowRight size={17} />
                  </a>
                </div>
              ))}
            </div>
            <div className="price__foot">
              <Clock3 size={15} /> Стоимость, расписание и наличие мест —
              уточните у администратора.
            </div>
          </div>
        </section>
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
              <p className="section__aside">
                Знакомьтесь: профиль для будущей команды. Имена и достижения
                ниже — редакционные плейсхолдеры.
              </p>
            </div>
            <div className="trainers__grid">
              {[
                [
                  "АРТЕМ «СЕВЕР»",
                  "Наставник по стрельбе из лука",
                  "«Сначала почувствуй дыхание. Потом отпусти.»",
                  "Плейсхолдер достижения: опыт, квалификация, награды — заполнить клубом.",
                  "ЛУК",
                ],
                [
                  "МИРА «ИСКРА»",
                  "Инструктор по метанию",
                  "«Точность начинается не с силы, а с внимания.»",
                  "Плейсхолдер: личный рекорд / участие в событиях — уточнить.",
                  "МЕТАНИЕ",
                ],
                [
                  "ГЛЕБ «ЩИТ»",
                  "Тренер по мягкому мечевому бою",
                  "«Безопасность — наш первый и главный приём.»",
                  "Плейсхолдер: стаж преподавания / достижения — заполнить.",
                  "МЕЧЕВОЙ БОЙ",
                ],
              ].map(([name, role, quote, achievement, discipline], index) => (
                <article
                  className="trainers__card reveal--on-scroll"
                  key={name}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`trainers__portrait trainers__portrait--${index + 1}`}
                  >
                    <span>{["С", "И", "Щ"][index]}</span>
                    <small>ПРОФИЛЬ ДЛЯ ЗАПОЛНЕНИЯ</small>
                  </div>
                  <div className="trainers__info">
                    <span className="eyebrow">{discipline}</span>
                    <h3>{name}</h3>
                    <p className="instructor-carousel__role">{role}</p>
                    <blockquote>{quote}</blockquote>
                    <p className="instructor-carousel__experience">
                      {achievement}
                    </p>
                  </div>
                </article>
              ))}
            </div>
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
                Оставь имя, телефон и направление. Администратор поможет сделать
                первый визит простым.
              </p>
              <div className="signup__promise">
                <Shield size={19} />
                <span>
                  Никакого опыта не требуется.
                  <br />
                  <b>Экипировка будет ждать.</b>
                </span>
              </div>
            </div>
            <div className="signup__panel reveal--on-scroll">
              <div className="signup__cap">
                <span>ФОРМА · ПЕРВЫЙ УРОВЕНЬ</span>
                <span>СВЯЗЬ С МАСТЕРОМ</span>
              </div>
              <h3 className="font-serif">Записаться на пробное</h3>
              <p>Оставь контакт — обсудим удобный формат.</p>
              <LeadForm />
              <div className="signup__footer">
                ОТПРАВКА ДЕМО · ПОДКЛЮЧЕНИЕ КЛУБОМ
              </div>
            </div>
          </div>
        </section>
        <section className="section section--location" id="contacts">
          <div className="wrap location__layout">
            <div className="location__copy reveal--on-scroll">
              <span className="eyebrow">ПРИХОДИ К НАМ</span>
              <h2 className="section__title">
                Приключение —<br />
                почти в центре города.
              </h2>
              <p>
                Точный адрес клуба и ориентиры сейчас уточняются. Напишите или
                позвоните — подскажем, как добраться.
              </p>
              <div className="location__contacts">
                <div>
                  <span>ТЕЛЕФОН</span>
                  <a href="#signup">
                    +7 (___) ___-__-__ <small>плейсхолдер — заменить</small>
                  </a>
                </div>
                <div>
                  <span>ВКОНТАКТЕ</span>
                  <a
                    href="https://vk.com/club_placeholder"
                    target="_blank"
                    rel="noreferrer"
                  >
                    vk.com/club_placeholder <small>ссылка для замены</small>
                  </a>
                </div>
              </div>
              <a className="button--ghost" href="#signup">
                Задать вопрос клубу <ArrowRight size={16} />
              </a>
            </div>
            <div className="location__map reveal--on-scroll">
              <div className="location__grid" />
              <div className="location__route location__route--a" />
              <div className="location__route location__route--b" />
              <div className="location__pin">
                <span>
                  <Compass size={20} />
                </span>
                <b>СВАРОГ</b>
              </div>
              <div className="location__corner location__corner-top">
                КЛУБ ПОЧТИ В ЦЕНТРЕ
                <br />
                ГОРОДА
              </div>
              <div className="location__corner location__corner-bottom">
                АДРЕС / ОРИЕНТИР
                <br />
                ЗАПОЛНИТЬ КЛУБУ
              </div>
              <div className="location__coord">
                МЕСТОПОЛОЖЕНИЕ
                <br />
                УТОЧНЯЕТСЯ
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap footer__inner">
          <a href="#top" className="brand">
            <span className="brand__mark">
              <span>С</span>
            </span>
            <span className="brand__name">
              СВАРОГ<small>КЛУБ ЖИВОЙ ИСТОРИИ</small>
            </span>
          </a>
          <p>
            Живая история. Настоящий азарт.
            <br />И место для первого шага.
          </p>
          <a className="footer__top" href="#top">
            Наверх <ChevronDown size={15} />
          </a>
        </div>
        <div className="wrap footer__bottom">
          <span>© СВАРОГ · ДАННЫЕ КЛУБА ДОБАВЯТСЯ ПОСЛЕ УТОЧНЕНИЯ</span>
          <a href="#signup">
            Оставить заявку <ArrowRight size={13} />
          </a>
        </div>
      </footer>
      <DirectionDialog
        selected={chosen}
        close={() => setChosen(null)}
        choose={() => goForm(chosen?.title)}
      />
      <button
        className={`header__sticky${stickyVisible ? " header__sticky--visible" : ""}`}
        aria-hidden={stickyVisible ? undefined : true}
        tabIndex={stickyVisible ? undefined : -1}
        onClick={() => goForm()}
      >
        Записаться на пробное <ArrowRight size={16} />
      </button>
    </div>
  );
}
