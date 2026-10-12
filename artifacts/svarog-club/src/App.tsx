import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ArrowDown, ArrowRight, Axe, BowArrow, Check, ChevronDown, Clock3, Compass, Crosshair, Menu, MoveUpRight, Shield, Sparkles, Swords, X, type LucideIcon } from 'lucide-react';
import heroImage from './assets/svarog-hero.jpg';
import './svarog.css';

const queryClient = new QueryClient();

type Direction = { id: string; number: string; icon: LucideIcon; title: string; subtitle: string; description: string; detail: string; features: string[] };
const directions: Direction[] = [
  { id:'bow', number:'01', icon:BowArrow, title:'Стрельба из лука', subtitle:'Тишина. Натяжение. Выстрел.', description:'Меткость, концентрация, традиционные и современные луки.', detail:'Начинаем с безопасной стойки и короткой дистанции. Тренер поможет подобрать хват, натяжение и ритм — а потом мишень начнёт отвечать на каждое движение.', features:['Подходит новичкам','Инструктаж и снаряжение клуба','Можно прийти одному или компанией'] },
  { id:'crossbow', number:'02', icon:Crosshair, title:'Стрельба из арбалета', subtitle:'Точность. Контроль. Попадание.', description:'Отдельное направление для тех, кому интересна точная стрельба из арбалета.', detail:'Познакомьтесь с арбалетом под руководством инструктора: разберём правила площадки и безопасную последовательность действий. Подходит для первого знакомства; наличие оборудования и условия уточняются у клуба.', features:['Отдельная дисциплина','Инструктаж перед стрельбой','Оборудование и условия — по запросу'] },
  { id:'throw', number:'03', icon:Axe, title:'Метание ножей и топоров', subtitle:'Попади в характер.', description:'Ножи и топоры. Перезагрузка, требующая внимания и точности.', detail:'Разберём механику броска с нуля: положение корпуса, дистанцию и безопасный выпуск. Начинаем с простых упражнений — никакого опыта не требуется.', features:['Пошаговое обучение','Снаряжение клуба','Только по правилам инструктора'] },
  { id:'combat', number:'04', icon:Swords, title:'СМБ · современный мечевой бой', subtitle:'Сражение без синяков.', description:'Безопасное фехтование на мягком оружии с защитной экипировкой.', detail:'Пробуй исторический фехтовальный азарт в мягком безопасном формате. Тренер покажет базовые действия и правила, экипировка предоставляется клубом.', features:['Мягкое безопасное оружие','Защитная экипировка клуба','Формат для начинающих'] },
];

const prices = [
  { name:'Пробное посещение', note:'Выбери направление и познакомься с клубом', price:'Уточнить у клуба', tag:'ПЕРВЫЙ ШАГ' },
  { name:'Абонемент: стрельба из лука и арбалета', note:'Это два отдельных направления; формат занятий уточните у клуба', price:'Уточнить у клуба' },
  { name:'Абонемент: метание', note:'Ножи и топоры', price:'Уточнить у клуба' },
  { name:'Абонемент: мечевой бой', note:'Мягкое оружие и защитная экипировка', price:'Уточнить у клуба' },
  { name:'Аренда дорожки и снаряжения', note:'Лук, арбалет, историческая одежда и другие предметы — наличие и условия уточняйте', price:'Уточнить у клуба' },
];

function LeadForm({ compact = false }: { compact?: boolean }) {
  const [name,setName] = useState(''); const [phone,setPhone] = useState(''); const [direction,setDirection] = useState(''); const [error,setError] = useState(''); const [sent,setSent] = useState(false);
  useEffect(()=>{const listener=(e:Event)=>setDirection((e as CustomEvent<string>).detail);window.addEventListener('svarog-direction',listener);return()=>window.removeEventListener('svarog-direction',listener);},[]);
  function simulateSubmit(payload: { name: string; phone: string; direction: string }) {
    console.info('Demo lead submission — connect to club CRM:', payload);
    return Promise.resolve({ ok:true });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    if (name.trim().length < 2) { setError('Укажи имя — хотя бы два символа.'); return; }
    const digits = phone.replace(/\D/g,'');
    if (digits.length < 10 || digits.length > 15) { setError('Проверь номер телефона: нужно не меньше 10 цифр.'); return; }
    if (!direction) { setError('Выбери направление, чтобы мы подготовили снаряжение.'); return; }
    await simulateSubmit({ name:name.trim(), phone:phone.trim(), direction }); setSent(true);
  }
  return sent ? <div className="success-card" role="status" data-testid="status-lead-success"><span className="success-icon"><Check size={22}/></span><div><strong>Демо-заявка заполнена.</strong><p>Данные не переданы клубу: отправка сейчас демонстрационная. Подключение контактов и обработку заявок нужно настроить.</p><button className="text-action" data-testid="button-reset-lead" onClick={()=>{setSent(false);setName('');setPhone('');setDirection('');}}>Заполнить ещё раз</button></div></div> :
    <form onSubmit={submit} className={`lead-form ${compact?'lead-form-compact':''}`} noValidate>
      <label>Как к вам обращаться<input className="field" data-testid="input-lead-name" value={name} onChange={e=>setName(e.target.value)} placeholder="Ваше имя" autoComplete="name" required /></label>
      <label>Номер телефона<input className="field" data-testid="input-lead-phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" type="tel" autoComplete="tel" required /></label>
      <label>Что попробуем первым?<select className="field" data-testid="select-lead-direction" value={direction} onChange={e=>setDirection(e.target.value)} required><option value="">Выберите направление</option>{directions.map(d=><option key={d.id} value={d.title}>{d.title}</option>)}</select></label>
      {error&&<p className="form-error" role="alert" data-testid="status-lead-error">{error}</p>}
      <button className="btn-primary submit-btn" data-testid="button-submit-lead" type="submit">Записаться на пробное <ArrowRight size={17}/></button>
      <p className="form-consent">Демонстрационная форма: данные не отправляются и не сохраняются. Контакты и обработку заявок должен подключить клуб.</p>
    </form>;
}

function DirectionDialog({ selected, close, choose }: { selected: Direction | null; close:()=>void; choose:()=>void }) {
  useEffect(()=>{ if (!selected) return; const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')close();}; window.addEventListener('keydown',onKey); document.body.style.overflow='hidden'; return ()=>{window.removeEventListener('keydown',onKey);document.body.style.overflow='';}; },[selected,close]);
  if (!selected) return null;
  const Icon=selected.icon;
  return <div className="dialog-scrim" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)close();}}><section className="direction-dialog" role="dialog" aria-modal="true" aria-labelledby="direction-dialog-title"><button className="icon-close" aria-label="Закрыть" onClick={close}><X size={20}/></button><span className="dialog-icon"><Icon size={25}/></span><span className="eyebrow">НАПРАВЛЕНИЕ {selected.number}</span><h2 id="direction-dialog-title" className="section-title">{selected.title}</h2><p className="dialog-detail">{selected.detail}</p><div className="detail-points">{selected.features.map(item=><div key={item}><Check size={15}/>{item}</div>)}</div><button className="btn-primary" onClick={choose}>Выбрать и записаться <ArrowRight size={17}/></button></section></div>;
}

function AppContent() {
  const [chosen,setChosen] = useState<Direction|null>(null); const [mobileOpen,setMobileOpen] = useState(false);
  useEffect(()=>{if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const nodes=document.querySelectorAll('.reveal-on-scroll');document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});nodes.forEach(node=>observer.observe(node));return()=>{observer.disconnect();document.documentElement.classList.remove('motion-ready');};},[]);
  const goForm=(direction?:string)=>{if(direction)window.dispatchEvent(new CustomEvent('svarog-direction',{detail:direction}));document.getElementById('signup')?.scrollIntoView({behavior:'smooth'});setChosen(null);setMobileOpen(false);};
  return <div className="site">
    <header className="topbar"><div className="wrap nav-inner">
      <a href="#top" className="brand" aria-label="Сварог — наверх"><span className="brand-mark"><span>С</span></span><span className="brand-name">СВАРОГ<small>КЛУБ ЖИВОЙ ИСТОРИИ</small></span></a>
      <nav className="nav-desktop" aria-label="Главная навигация"><a className="nav-link" href="#directions">Направления</a><a className="nav-link" href="#first-visit">Первый визит</a><a className="nav-link" href="#events">События</a><a className="nav-link" href="#team-building">Командам</a><a className="nav-link" href="#partners">Партнёры</a><a className="nav-link" href="#services">Услуги</a><a className="nav-link" href="#prices">Цены</a><a className="nav-link" href="#contacts">Контакты</a></nav>
      <a className="nav-cta" href="#signup">Попробовать <ArrowRight size={15}/></a>
      <button className="mobile-menu-btn" data-testid="button-mobile-menu" aria-label={mobileOpen?'Закрыть меню':'Открыть меню'} aria-expanded={mobileOpen} onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X/>:<Menu/>}</button>
    </div>{mobileOpen&&<nav className="mobile-nav" aria-label="Мобильная навигация">{[['Направления','#directions'],['Первый визит','#first-visit'],['События','#events'],['Командам','#team-building'],['Нам доверяют','#partners'],['Услуги','#services'],['Цены','#prices'],['Контакты','#contacts']].map(([label,href])=><a key={href} href={href} onClick={()=>setMobileOpen(false)}>{label}<ArrowRight size={15}/></a>)}</nav>}</header>

    <main id="top">
      <section className="hero">
        <div className="hero-image" style={{backgroundImage:`url(${heroImage})`}}/><div className="hero-shade"/>
        <div className="hero-rune" aria-hidden="true">ᛊ</div>
        <div className="wrap hero-content"><div className="hero-copy reveal">
          <div className="hero-overline"><span className="overline-mark"/> ИСТОРИЯ, КОТОРУЮ МОЖНО ПРОЖИТЬ</div>
          <div className="crest"><span className="crest-line"/><span className="crest-text">С В А Р О Г</span><span className="crest-line"/></div>
          <h1 className="display">Клуб живой истории<br/>и оружия <em>Сварог.</em><br/><span>Почувствуй дух приключений<br/>в самом центре города!</span></h1>
          <p className="hero-description">Лук и арбалет, метание, безопасный бой на мягких мечах. Первый раз? Именно с этого и начинается путь.</p>
          <div className="hero-actions"><a className="btn-primary" href="#signup">Записаться на пробное <ArrowRight size={17}/></a><a className="btn-ghost" href="#directions">Выбрать направление <ArrowDown size={15}/></a></div>
          <div className="hero-note"><Shield size={15}/> Начинающим рады. Снаряжение и вводный инструктаж — в клубе.</div>
        </div>
        <div className="hero-seal" aria-label="Сварог — клуб приключений"><Sparkles className="seal-star" size={20}/><span>ВОЙДИ<br/>В ЛЕГЕНДУ</span><small>С · Ж · И</small></div>
        <div className="hero-bottom"><span>ЖИВАЯ ИСТОРИЯ В ГОРОДЕ</span><span>01 / ПЕРВЫЙ ШАГ</span></div></div>
      </section>

      <section className="intro-strip"><div className="wrap intro-grid"><div className="intro-title"><span className="eyebrow">НЕ НУЖНО БЫТЬ ГЕРОЕМ</span><h2 className="serif">Достаточно<br/>прийти.</h2></div><p>Мы создали пространство, где можно попробовать новое без подготовки и специальной формы. Тренер встретит, покажет основы и поможет выбрать темп — от первой стрелы или арбалетного выстрела до дружеского поединка.</p><div className="intro-stats"><div><strong>4</strong><span>направления</span></div><i/><div><strong>0</strong><span>опыта нужно</span></div></div></div></section>

      <section className="section directions-section" id="directions"><div className="wrap"><div className="section-head reveal-on-scroll"><div><span className="eyebrow">ВЫБЕРИ СВОЙ ПУТЬ · 01—04</span><h2 className="section-title">Четыре способа<br/>выйти из привычного.</h2></div><p className="section-aside">Лук и арбалет — два самостоятельных направления. Везде можно начать с нуля; наличие снаряжения и условия уточняются у клуба.</p></div>
        <div className="direction-grid">{directions.map((d,i)=>{const Icon=d.icon;return <button className={`direction-card card reveal-on-scroll d${i+1}`} key={d.id} data-testid={`card-direction-${d.id}`} onClick={()=>setChosen(d)}><div className="direction-top"><span>{d.number} / ПУТЬ</span><MoveUpRight size={17}/></div><div className="direction-art"><div className={`direction-symbol symbol-${d.id}`}><Icon size={55} strokeWidth={1.15}/></div><span className="art-coordinate">{d.id==='bow'?'01 / ЛУК':d.id==='crossbow'?'02 / АРБАЛЕТ':d.id==='throw'?'03 / МЕТАНИЕ':'04 / ПОЕДИНОК'}</span></div><div className="direction-copy"><span className="eyebrow">{d.subtitle}</span><h3 className="serif">{d.title}</h3><p>{d.description}</p><span className="card-more">Узнать больше <ArrowRight size={14}/></span></div></button>})}</div>
      </div></section>

      <section className="section first-visit-section" id="first-visit"><div className="wrap visit-layout"><div className="visit-intro reveal-on-scroll"><span className="eyebrow">КВЕСТ ДЛЯ НОВИЧКА · УРОВЕНЬ 01</span><h2 className="section-title">Первый визит —<br/><i>без сюрпризов.</i></h2><p>Четыре простых шага. Никаких проверок на «своего» — только любопытство и желание попробовать.</p><a className="text-action" href="#signup">Забронировать первое приключение <ArrowRight size={15}/></a></div><div className="steps-list">{[['01','Оставь заявку','Выбери направление — мы уточним детали и время.'],['02','Приходи как есть','Удобная спортивная одежда — всё снаряжение мы выдадим.'],['03','Слушай инструктора','Опытный мастер объяснит основы безопасности и техники.'],['04','Попробуй сам','Сделаешь первые выстрелы, броски или проведёшь первый бой.']].map(([n,t,d],i)=><div className="step-row reveal-on-scroll" style={{transitionDelay:`${i*90}ms`}} key={n}><span className="step-number">{n}</span><div><h3>{t}</h3><p>{d}</p></div><span className="step-state">{i===0?<Compass size={17}/>:<ArrowRight size={17}/>}</span></div>)}</div></div></section>

      <section className="event-section" id="events"><div className="event-art" aria-hidden="true"/><div className="wrap event-content reveal-on-scroll"><div className="event-tag"><Sparkles size={15}/> ОСОБОЕ СОБЫТИЕ</div><span className="eyebrow">СКОРО В КЛУБЕ · ДАТА УТОЧНЯЕТСЯ</span><h2 className="display">Хэллоуин<br/><span>в чертогах Сварога</span></h2><p>Турнир нечисти, тематические фотозоны и метание топоров в тыквы. Костюм не обязателен — настроение приключения уже в программе.</p><a className="btn-ghost" href="#signup">Спросить о событии <ArrowRight size={16}/></a><small className="event-disclaimer">Формат, дата и условия проведения будут объявлены клубом отдельно.</small></div><div className="event-side-label">ОСОБЫЕ СОБЫТИЯ · СКОРО</div></section>

      <section className="section gatherings-section"><div className="wrap gathering-layout"><div className="gathering-title reveal-on-scroll"><span className="eyebrow">СОБЕРИТЕ СВОЮ ГРУППУ</span><h2 className="section-title">Есть повод.<br/>Есть Сварог.</h2><p>Живой формат для тех, кому хочется не просто посидеть за столом.</p><a className="btn-primary" href="#signup">Обсудить ваш формат <ArrowRight size={16}/></a></div><div className="gathering-list">{[['День рождения в стиле D&D','Праздник, где каждый попробует новое и унесёт свою историю.'],['Командам','Корпоративный формат с инструктажем, активностями и общим азартом.'],['Для двоих','Необычное свидание: поддержать, посоревноваться, запомнить.'],['Аренда клуба','Закрытый формат для вашей компании — детали и доступность уточняйте.']].map(([title,desc],i)=><article className="gathering-item reveal-on-scroll" key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{desc}</p></div><ArrowRight size={17}/></article>)}</div></div>
        <div id="team-building" className="wrap team-offer reveal-on-scroll"><div className="team-offer-mark">ДЛЯ КОМАНД</div><div><span className="eyebrow">НЕ ГОТОВЫЙ СЦЕНАРИЙ, А ТОЧНОЕ ПОПАДАНИЕ</span><h3>Сначала разбираемся в задаче.</h3><p>Начинаем с диагностики сложностей бизнеса и команды. Затем подбираем иммерсивную игру и метательные активности под ваш запрос — чтобы коллеги стали ближе и вместе проработали актуальные организационные проблемы.</p></div><a className="text-action" href="#signup">Обсудить задачу <ArrowRight size={15}/></a></div>
      </section>

      <section className="section capital-section"><div className="wrap capital-layout reveal-on-scroll"><div><span className="eyebrow">СВОЯ ШКОЛА · СВОЙ ХАРАКТЕР</span><h2 className="display">Столица<br/><em>Нестандартного<br/>Метания</em></h2></div><div className="capital-copy"><span className="capital-index">ТАТАРСТАН · И ДАЛЬШЕ</span><p>Сварог — пионеры и родоначальники многих необычных упражнений в метании, а также ролевых и метательных событий в Татарстане и за его пределами.</p><p>Здесь привычное упражнение может стать частью истории: с правилами, сюжетом и азартом, который объединяет людей.</p><a className="text-action" href="#events">Смотреть события <ArrowRight size={15}/></a></div></div></section>

      <section className="section rental-section" id="services"><div className="wrap rental-layout"><div className="rental-art reveal-on-scroll"><span className="rental-rune" aria-hidden="true">ᛊ</span><span className="rental-art-label">ИСТОРИЧЕСКИЙ ОБРАЗ · В АРЕНДУ</span></div><div className="rental-copy reveal-on-scroll"><span className="eyebrow">ПРЕДМЕТЫ С ИСТОРИЕЙ</span><h2 className="section-title">Средневековый<br/>образ — напрокат.</h2><p>В клубе можно арендовать историческую одежду и снаряжение: мечи, кольчуги, луки и другие предметы. Наличие и условия аренды уточняются у команды.</p><p>Снаряжение уже предоставляли для короткометражных фильмов, рекламных роликов и тематических мероприятий барбершопов.</p><a className="btn-ghost" href="#signup">Уточнить наличие <ArrowRight size={16}/></a></div></div></section>

      <section className="section partners-section" id="partners"><div className="wrap"><div className="section-head reveal-on-scroll"><div><span className="eyebrow">СОВМЕСТНЫЕ СОБЫТИЯ И ПРОЕКТЫ</span><h2 className="section-title">Нам доверяют</h2></div><p className="section-aside">Бренды и события, с которыми клуб работал. Типографические подписи — не официальные логотипы.</p></div><div className="partner-grid reveal-on-scroll">{['Т-Банк','Татнефть','Фестиваль Каракуз','И другие партнёры'].map((name,i)=><div className={`partner-name partner-${i+1}`} key={name}><span>{name}</span>{i===3&&<small>РАЗНЫЕ КОМАНДЫ И СОБЫТИЯ</small>}</div>)}</div></div></section>

      <section className="section prices-section" id="prices"><div className="wrap"><div className="section-head reveal-on-scroll"><div><span className="eyebrow">ПОНЯТНЫЕ УСЛОВИЯ</span><h2 className="section-title">Сколько стоит<br/>первый шаг?</h2></div><p className="section-aside">Точные цены клуб не указал — мы не будем придумывать. Напишите нам, и администратор подскажет актуальные условия.</p></div><div className="price-table reveal-on-scroll">{prices.map((item,i)=><div className={`price-row ${i===0?'price-featured':''}`} key={item.name}><div className="price-name">{item.tag&&<span className="price-tag">{item.tag}</span>}<strong>{item.name}</strong><small>{item.note}</small></div><span className="price-value">{item.price}</span><a href="#signup" aria-label={`Узнать цену: ${item.name}`} className="price-link"><ArrowRight size={17}/></a></div>)}</div><div className="price-foot"><Clock3 size={15}/> Стоимость, расписание и наличие мест — уточните у администратора.</div></div></section>

      <section className="section trainers-section"><div className="wrap"><div className="section-head reveal-on-scroll"><div><span className="eyebrow">ЛЮДИ, КОТОРЫЕ ВСТРЕТЯТ</span><h2 className="section-title">Наставники<br/>вашего первого шага.</h2></div><p className="section-aside">Имена, фотографии, биографии и прочие достижения требуют подтверждения клуба. Стаж метания у каждого инструктора — более 3 лет.</p></div><div className="trainer-grid">{[['АРТЕМ «СЕВЕР»','Наставник по стрельбе из лука и арбалета','«Сначала почувствуй дыхание. Потом отпусти.»','Имя, стаж преподавания и квалификация — подтвердить клубом.','ЛУК И АРБАЛЕТ'],['МИРА «ИСКРА»','Инструктор по метанию','«Точность начинается не с силы, а с внимания.»','Имя и личные достижения — подтвердить клубом.','МЕТАНИЕ'],['ГЛЕБ «ЩИТ»','Тренер по мягкому мечевому бою','«Безопасность — наш первый и главный приём.»','Имя, стаж преподавания и достижения — подтвердить клубом.','МЕЧЕВОЙ БОЙ']].map(([name,role,quote,achievement,discipline],i)=><article className="trainer-card reveal-on-scroll" key={name} style={{transitionDelay:`${i*100}ms`}}><div className={`trainer-portrait portrait-${i+1}`}><span>{['С','И','Щ'][i]}</span><small>ПРОФИЛЬ ДЛЯ ЗАПОЛНЕНИЯ</small></div><div className="trainer-info"><span className="eyebrow">{discipline}</span><h3>{name}</h3><p className="trainer-role">{role}</p><blockquote>{quote}</blockquote><p className="achievement">{achievement}</p></div></article>)}</div><p className="instructor-proof">Стаж метания у всех инструкторов — более 3 лет.</p></div></section>

      <section className="signup-section" id="signup"><div className="signup-flare"/><div className="wrap signup-layout"><div className="signup-copy reveal-on-scroll"><span className="eyebrow">ТВОЯ ИСТОРИЯ НАЧИНАЕТСЯ ЗДЕСЬ</span><h2 className="display">Не наблюдай<br/>за приключением.<br/><em>Войди в него.</em></h2><p>Оставь имя, телефон и направление. Администратор поможет сделать первый визит простым.</p><div className="signup-promise"><Shield size={19}/><span>Никакого опыта не требуется.<br/><b>Экипировка будет ждать.</b></span></div></div><div className="signup-panel reveal-on-scroll"><div className="panel-cap"><span>ФОРМА · ПЕРВЫЙ УРОВЕНЬ</span><span>СВЯЗЬ С МАСТЕРОМ</span></div><h3 className="serif">Записаться на пробное</h3><p>Оставь контакт — обсудим удобный формат.</p><LeadForm/><div className="panel-footer">ОТПРАВКА ДЕМО · ПОДКЛЮЧЕНИЕ КЛУБОМ</div></div></div></section>

      <section className="section location-section" id="contacts"><div className="wrap location-layout"><div className="location-copy reveal-on-scroll"><span className="eyebrow">ПРИХОДИ К НАМ</span><h2 className="section-title">Приключение —<br/>почти в центре города.</h2><p>Точный адрес клуба и ориентиры сейчас уточняются. Напишите или позвоните — подскажем, как добраться.</p><div className="contact-lines"><div><span>ТЕЛЕФОН</span><a href="#signup">+7 (___) ___-__-__ <small>плейсхолдер — заменить</small></a></div><div><span>ВКОНТАКТЕ</span><a href="https://vk.com/club_placeholder" target="_blank" rel="noreferrer">vk.com/club_placeholder <small>ссылка для замены</small></a></div></div><a className="btn-ghost" href="#signup">Задать вопрос клубу <ArrowRight size={16}/></a></div><div className="map-card reveal-on-scroll"><div className="map-grid"/><div className="map-route route-a"/><div className="map-route route-b"/><div className="map-pin"><span><Compass size={20}/></span><b>СВАРОГ</b></div><div className="map-corner map-top">КЛУБ ПОЧТИ В ЦЕНТРЕ<br/>ГОРОДА</div><div className="map-corner map-bottom">АДРЕС / ОРИЕНТИР<br/>ЗАПОЛНИТЬ КЛУБУ</div><div className="map-coord">МЕСТОПОЛОЖЕНИЕ<br/>УТОЧНЯЕТСЯ</div></div></div></section>
    </main>
    <footer className="footer"><div className="wrap footer-inner"><a href="#top" className="brand"><span className="brand-mark"><span>С</span></span><span className="brand-name">СВАРОГ<small>КЛУБ ЖИВОЙ ИСТОРИИ</small></span></a><p>Живая история. Настоящий азарт.<br/>И место для первого шага.</p><a className="footer-top" href="#top">Наверх <ChevronDown size={15}/></a></div><div className="wrap footer-bottom"><span>© СВАРОГ · ДАННЫЕ КЛУБА ДОБАВЯТСЯ ПОСЛЕ УТОЧНЕНИЯ</span><a href="#signup">Оставить заявку <ArrowRight size={13}/></a></div></footer>
    <DirectionDialog selected={chosen} close={()=>setChosen(null)} choose={()=>goForm(chosen?.title)}/>
    <button className="mobile-sticky-cta" onClick={()=>goForm()}>Записаться на пробное <ArrowRight size={16}/></button>
  </div>;
}

function Home() { return <AppContent/>; }
function Router() { return <RoutedErrorBoundary><Switch><Route path="/" component={Home}/><Route component={NotFound}/></Switch></RoutedErrorBoundary>; }
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}><Router/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>; }
export default App;
