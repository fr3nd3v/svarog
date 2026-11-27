import { ErrorBoundary } from "@/components/error-boundary";
import InstructorCarousel from "@/components/instructor-carousel";
import SvarogPricing from "@/components/svarog-pricing";
import {
  CLUB_PHONE_HREF,
  CLUB_PHONE_LABEL,
  CLUB_ADDRESS,
  CLUB_MAP_LINKS,
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
  MapPin,
  Menu,
  MessageCircle,
  MoveUpRight,
  Phone,
  Shield,
  Swords,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import "./svarog.css";

const svarogLogo = publicAssetUrl("svarog-star-red.webp");
const heroImage = publicAssetUrl("svarog-hero.webp");

const navigation = [
  ["Направления", "#directions"],
  ["Первое занятие", "#first-visit"],
  ["Цены", "#prices"],
  ["Наставники", "#trainers"],
  ["Контакты", "#contacts"],
];

type Direction = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
  features: string[];
};
const directions: Direction[] = [
  {
    id: "throw",
    icon: Axe,
    title: "Метание ножей и топоров",
    description: "Спортивное метание по мишеням.",
    detail: "Можно начать с вводного занятия и продолжить регулярными тренировками.",
    features: ["Занятия с наставником", "Снаряжение выдаёт клуб"],
  },
  {
    id: "bow",
    icon: BowArrow,
    title: "Стрельба из лука",
    description: "Стрельба по мишеням. Также можно попробовать арбалет.",
    detail: "Наставник поможет выбрать снаряжение для первого занятия.",
    features: ["Лук и арбалет", "Подходит новичкам"],
  },
  {
    id: "combat",
    icon: Swords,
    title: "Современный мечевой бой (СМБ)",
    description: "Спортивное фехтование на мягком оружии с защитной экипировкой.",
    detail: "На первом занятии наставник объяснит правила и предложит упражнения для начинающих.",
    features: ["Мягкие мечи", "Защитная экипировка клуба"],
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
          Записаться на занятие <ArrowRight size={17} />
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
            {navigation.map(([label, href]) => (
              <a key={href} className="header__link" href={href}>{label}</a>
            ))}
          </nav>
          <a className="header__cta" href="#signup">
            Записаться <ArrowRight size={15} />
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
            {navigation.map(([label, href]) => (
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
                <span className="hero__mark" /> Сварог · Набережные Челны
              </div>
              <h1 className="font-display">
                Метание ножей, стрельба из лука и современный мечевой бой
              </h1>
              <p className="hero__description">
                Можно начать с нуля. Наставник поможет выбрать направление и освоиться на первом занятии.
              </p>
              <div className="hero__actions" ref={heroActionsRef}>
                <a className="button--primary" href="#signup">
                  Записаться на занятие <ArrowRight size={17} />
                </a>
                <a className="button--ghost" href="#prices">
                  Посмотреть цены <ArrowDown size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--directions" id="directions">
          <div className="wrap">
            <div className="section__head reveal--on-scroll">
              <h2 className="section__title">Направления</h2>
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
                      <MoveUpRight size={17} />
                    </div>
                    <div className="direction-card__art">
                      <div
                        className={`direction-card__symbol direction-card__symbol--${d.id}`}
                      >
                        <Icon size={55} strokeWidth={1.15} />
                      </div>
                    </div>
                    <div className="direction-card__copy">
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
            <a className="action-link directions__visit-link" href="#first-visit">
              Как проходит первое занятие <ArrowRight size={15} />
            </a>
          </div>
        </section>

        <section className="section section--visit" id="first-visit">
          <div className="wrap visit__layout">
            <div className="visit__intro reveal--on-scroll">
              <h2 className="section__title">Как проходит первое занятие</h2>
              <p>Выберите одно направление или заранее договоритесь, чтобы попробовать несколько за один визит.</p>
              <a className="action-link" href="#signup">
                Записаться на занятие <ArrowRight size={15} />
              </a>
            </div>
            <div className="visit__steps">
              {[
                ["От 1 часа", "Точную длительность уточним при записи."],
                ["Снаряжение выдаёт клуб", "Приходите в удобной спортивной одежде."],
                ["Занятие с наставником", "Наставник объяснит правила и проведёт первые упражнения."],
              ].map(([title, description]) => (
                <div className="visit__step visit__step--compact reveal--on-scroll" key={title}>
                  <div><h3>{title}</h3><p>{description}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SvarogPricing />

        <section className="section section--trainers" id="trainers">
          <div className="wrap">
            <div className="section__head reveal--on-scroll">
              <h2 className="section__title">Наставники «Сварога»</h2>
            </div>
            <InstructorCarousel />
            <p className="trainers__proof">
              От первого броска до мастерства — каждый путь начинается с наставника.
            </p>
          </div>
        </section>

        <section className="section section--gatherings" id="team-building">
          <div className="wrap gatherings__layout">
            <div className="gatherings__title reveal--on-scroll">
              <h2 className="section__title">Занятия для компаний</h2>
              <p>Напишите, сколько вас и что хотите попробовать. Подберём программу и согласуем время.</p>
              <div className="location__actions">
                <a className="button--primary" href={CLUB_VK_URL} target="_blank" rel="noopener noreferrer">
                  Обсудить визит <ArrowRight size={16} />
                </a>
                <a className="action-link" href="#prices">Посмотреть цены</a>
              </div>
            </div>
            <ul className="gatherings__formats reveal--on-scroll">
              <li>День рождения в стиле викингов</li>
              <li>Корпоратив и тимбилдинг</li>
              <li>Занятие для двоих</li>
              <li>Аренда клуба</li>
            </ul>
          </div>
          <div className="wrap gatherings__offer reveal--on-scroll" id="services">
            <div>
              <h3>Прокат исторической одежды и снаряжения</h3>
              <p>Костюмы, кольчуги и реквизит для съёмок и мероприятий.</p>
            </div>
            <a className="action-link" href={CLUB_VK_URL} target="_blank" rel="noopener noreferrer">
              Уточнить наличие <ArrowRight size={15} />
            </a>
          </div>
          <div className="wrap gatherings__partners" id="partners">
            <p>Совместные проекты: Т-Банк, Татнефть, фестиваль «Каракуз».</p>
          </div>
        </section>

        <section className="section section--location" id="contacts">
          <div className="wrap location__layout">
            <div className="location__copy reveal--on-scroll" id="signup">
              <h2 className="section__title">Как записаться и добраться</h2>
              <p>Напишите ВКонтакте или позвоните, чтобы согласовать время.</p>
              <div className="location__actions">
                <a className="button--primary" href={CLUB_VK_URL} target="_blank" rel="noopener noreferrer" data-testid="link-club-vk">
                  <MessageCircle size={17} /> Написать ВКонтакте
                </a>
                <a className="button--ghost" href={CLUB_PHONE_HREF} data-testid="link-club-phone">
                  <Phone size={17} /> {CLUB_PHONE_LABEL}
                </a>
              </div>
              <address className="location__address">{CLUB_ADDRESS}</address>
            </div>

            <div className="location__map reveal--on-scroll">
              <iframe
                className="location__frame"
                id="map_551189963"
                width="100%"
                height="600px"
                title="Клуб «Сварог» на карте 2ГИС"
                loading="lazy"
                src="https://makemap.2gis.ru/widget?data=eJxFUl2PojAU_S_dxzGTUgHRZB4cdAAHEFlnkG7mgY8uVAslUD_AzH_fqrvZNn2555x7T3PPFfA2Jy3JLcIrIlpKOjD7dQWibwiYgTeSiGNLwAg0LW9IK-74FWSc8VbiPyAylN9I4oIKdlPAd3vTCfMM48XmJMxBQjnpspY2gvJaEgJ7_hRYyyKxVwzvIU3sEGa2p7u90WPEBrdeKS7SyrjyOY4uR_JzWuPIOPnD_Owtbm959veZ5i0cdb2NqWOHZVblLF9AukOrLo601qGvQ26zDm8hxRYbMutSki0vkkjr5GNutOpS5Lfr_vUcR-FB1uo1nauZXRTeFp_Joivi6m2foLxPx59HbCr7FF1O2Z4XzvChxJUjfUgOmnbp2NEd06_w_cYTx8KntN6IHH02GJVwTV-p1B7kLIh3JXSjkEldH-_CJkWq7ljaKa0-pG51yqqQZVTppacm33m6swjvXnA1PeamUsWR0qT2QXdsv0xrT2Tos0-i_zMzxHQs_-lt7zoaCJPA2N0chTWH8SkshOU5vtk7C3dzmJoxfF8aLlo-Beb0HBQvL3JZg1Pn5AJmCvx3vkegeISjv63-bzICTmsh-RmXAaJ1Iu7B0dCzqqoI6iNNe56ohq4oX1JPczBDcGp8f41AlTQB7-gjDVfAEgFmD7KmQlVTJvpYMUaA3eBHO2iohoEmY_3WFwycV9KeIdvKWHHGopIQhu9V0R7J9x8Doeo-"
                sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
              />
              <div className="location__actions" role="group" aria-label="Открыть адрес на карте">
                {CLUB_MAP_LINKS.map(({ label, href }) => (
                  <a key={label} className="button--ghost" href={href} target="_blank" rel="noopener noreferrer">
                    <MapPin size={16} aria-hidden="true" /> {label}
                  </a>
                ))}
              </div>
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
        Записаться на занятие
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
