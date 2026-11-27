export const CLUB_PHONE_LABEL = '+7 (917) 933-23-02';
export const CLUB_PHONE_HREF = 'tel:+79179332302';
export const CLUB_VK_URL = 'https://vk.ru/svarog_knife';
export const CLUB_VK_LABEL = 'vk.ru/svarog_knife';
export const CLUB_ADDRESS = 'ДЦ «Форт Диалог», Московский проспект, 140, Набережные Челны';
const addressQuery = encodeURIComponent('Набережные Челны, Московский проспект, 140');

export const CLUB_MAP_LINKS = [
  { label: 'Яндекс Карты', href: `https://yandex.ru/maps/?text=${addressQuery}` },
  { label: 'Google Maps', href: `https://www.google.com/maps/search/?api=1&query=${addressQuery}` },
];
