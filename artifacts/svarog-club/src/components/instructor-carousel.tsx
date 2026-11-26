import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import { instructors } from '@/data/instructors';
import { publicAssetUrl } from '@/lib/public-asset-url';

export default function InstructorCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const profile = instructors[activeIndex];

  const goTo = (index: number) => {
    setActiveIndex((index + instructors.length) % instructors.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const distance = touchStartX.current - event.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(distance) > 45) goTo(activeIndex + (distance > 0 ? 1 : -1));
  };

  return (
    <div className="instructor-carousel" data-testid="carousel-instructors">
      <div
        className="instructor-carousel__viewport"
        role="region"
        aria-label="Наставники клуба"
        aria-roledescription="карусель"
        aria-live="polite"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <article
          className="instructor-carousel__card"
          data-testid={`card-instructor-${profile.id}`}
          aria-label={`Профиль ${activeIndex + 1} из ${instructors.length}`}
        >
          <div className="instructor-carousel__photo">
            {profile.photo ? (
              <img
                src={publicAssetUrl(profile.photo)}
                alt={profile.photoAlt || `Фото: ${profile.role}`}
                width="720"
                height="840"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className="instructor-carousel__placeholder"
                role="img"
                aria-label={`Фотография: ${profile.role}`}
              >
                <span>{profile.discipline.slice(0, 1)}</span>
                <Camera size={21} aria-hidden="true" />
                <small>ФОТО НАСТАВНИКА</small>
              </div>
            )}
          </div>
          <div className="instructor-carousel__info">
            <span className="eyebrow">{profile.discipline}</span>
            <h3>{profile.name}</h3>
            <p className="instructor-carousel__role">{profile.role}</p>
            <p className="instructor-carousel__text">{profile.introduction}</p>
            <p className="instructor-carousel__experience">{profile.experience}</p>
          </div>
        </article>
      </div>

      <div className="instructor-carousel__controls">
        <button
          type="button"
          className="instructor-carousel__arrow"
          aria-label="Предыдущий наставник"
          data-testid="button-instructor-previous"
          onClick={() => goTo(activeIndex - 1)}
        >
          <ArrowLeft size={19} />
        </button>
        <div className="instructor-carousel__pagination" aria-label="Выбор наставника">
          {instructors.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`instructor-carousel__dot ${index === activeIndex ? 'instructor-carousel__dot--active' : ''}`}
              aria-label={`Показать профиль ${index + 1}: ${item.role}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              data-testid={`button-instructor-slide-${item.id}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <span className="instructor-carousel__count" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, '0')} / {String(instructors.length).padStart(2, '0')}
        </span>
        <button
          type="button"
          className="instructor-carousel__arrow"
          aria-label="Следующий наставник"
          data-testid="button-instructor-next"
          onClick={() => goTo(activeIndex + 1)}
        >
          <ArrowRight size={19} />
        </button>
      </div>
    </div>
  );
}
