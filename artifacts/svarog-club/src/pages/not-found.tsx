import {
  CLUB_PHONE_HREF,
  CLUB_PHONE_LABEL,
  CLUB_VK_URL,
} from '@/lib/club-contact';

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="wrap">
        <span className="eyebrow">404</span>
        <h1 className="font-display">Страница не найдена</h1>
        <p>
          Такой страницы нет. Вернитесь на главную или свяжитесь с клубом по
          телефону и во ВКонтакте.
        </p>
        <div className="event__links">
          <a href={import.meta.env.BASE_URL}>На главную</a>
          <a href={CLUB_PHONE_HREF}>{CLUB_PHONE_LABEL}</a>
          <a href={CLUB_VK_URL} target="_blank" rel="noopener noreferrer">
            Связаться по VK
          </a>
        </div>
      </div>
    </main>
  );
}
