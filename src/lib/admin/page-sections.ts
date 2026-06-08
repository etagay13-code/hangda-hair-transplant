// Section blueprint for the admin per-page editor.
// Each public page is built from N sections; for each we declare its
// page_blocks key (where the text overrides live), the optional collection
// table it lists (gallery, services, etc.), an informational note, and a
// short label/icon for the admin card header.

export type PageKey = 'home' | 'about' | 'services' | 'gallery' | 'blog' | 'contact';

export type SectionDef =
  | {
      key: string;
      title: string;
      description: string;
      icon: string;
      type: 'block-with-extra' | 'block-text-only';
      note?: string;
    }
  | {
      key: string;
      title: string;
      description: string;
      icon: string;
      type: 'collection';
      note?: string;
      collection: {
        table: 'gallery' | 'services' | 'testimonials' | 'faq' | 'team_members' | 'blog_posts';
        adminBase: string; // e.g. '/admin/gallery'
        primaryField: string; // e.g. 'patient_code' or 'title' or 'question'
        secondaryField?: string;
        imageField?: string;
      };
    };

export interface PageConfig {
  title: string;
  description: string;
  live: string;
  sections: SectionDef[];
}

export const PAGE_SECTIONS: Record<PageKey, PageConfig> = {
  home: {
    title: 'Ana Sayfa',
    description: 'Anasayfadaki tüm bölümler. Her bölüm aşağıda kart olarak listelenir; metinleri o anda yayında olan değerlerle birlikte görür, doğrudan düzenleyip kaydedebilirsiniz. Galeri / hizmet / yorum gibi koleksiyonlarda kartı altta görüp ekleyebilir, düzenleyebilir, silebilirsiniz.',
    live: '/',
    sections: [
      {
        key: 'hero',
        title: 'Hero / Üst Banner',
        description: 'Sayfanın en üstündeki tanıtım alanı, istatistikler ve görsel.',
        icon: '🎯',
        type: 'block-with-extra',
      },
      {
        key: 'departments',
        title: 'Uzman Departmanlar',
        description: 'Cerrahi / Özel restorasyon / PRP departmanlarını gösteren sekmeli bölüm.',
        icon: '🏥',
        type: 'block-text-only',
        note: 'Departman kartlarındaki başlık, açıklama ve istatistikler messages/{tr,nl,en}.json dosyasındaki "Departments" alanından gelir. Bu bölümde sadece üstteki ortak metni düzenleyebilirsiniz.',
      },
      {
        key: 'services',
        title: 'Hizmetlerimiz',
        description: 'Hizmet katalog kartları. Üstteki başlık + hizmet listesi.',
        icon: '⚕️',
        type: 'collection',
        collection: {
          table: 'services',
          adminBase: '/admin/services',
          primaryField: 'title',
          secondaryField: 'short_description',
          imageField: 'image_url',
        },
      },
      {
        key: 'process',
        title: 'Bizimle Yolculuğunuz',
        description: '4 adımlı süreç anlatımı.',
        icon: '🛤',
        type: 'block-text-only',
        note: '4 adımın başlık ve açıklaması çeviri dosyasındaki "Process" alanından gelir.',
      },
      {
        key: 'gallery',
        title: 'Öncesi & Sonrası',
        description: 'Hasta öncesi/sonrası vakaları. Üstteki başlık + vaka listesi.',
        icon: '🖼',
        type: 'collection',
        collection: {
          table: 'gallery',
          adminBase: '/admin/gallery',
          primaryField: 'patient_code',
          secondaryField: 'technique',
          imageField: 'after_image_url',
        },
      },
      {
        key: 'included',
        title: 'Pakete Dahil Olanlar',
        description: 'Tek şeffaf fiyat + dahil olan 9 madde.',
        icon: '📦',
        type: 'block-text-only',
        note: 'Maddelerin (cerrah konsültasyonu, kan testleri, vs.) içeriği çeviri dosyasındaki "Included" alanından gelir.',
      },
      {
        key: 'recovery',
        title: '18 Aylık İyileşme',
        description: 'Aşama aşama iyileşme zaman çizelgesi.',
        icon: '⏳',
        type: 'block-text-only',
        note: '6 aşamanın içeriği çeviri dosyasındaki "Recovery" alanından gelir.',
      },
      {
        key: 'testimonials',
        title: 'Hasta Hikayeleri',
        description: 'Yorum kartları. Üstteki başlık + yorum listesi.',
        icon: '⭐',
        type: 'collection',
        collection: {
          table: 'testimonials',
          adminBase: '/admin/testimonials',
          primaryField: 'name',
          secondaryField: 'comment',
          imageField: 'image_url',
        },
      },
      {
        key: 'faq',
        title: 'Sıkça Sorulan Sorular',
        description: 'SSS akordeon listesi.',
        icon: '❓',
        type: 'collection',
        collection: {
          table: 'faq',
          adminBase: '/admin/faq',
          primaryField: 'question',
          secondaryField: 'answer',
        },
      },
      {
        key: 'contact',
        title: 'İletişim Bölümü',
        description: 'Sayfanın altındaki iletişim form bölümü tanıtımı.',
        icon: '✉️',
        type: 'block-text-only',
      },
    ],
  },
  about: {
    title: 'Hakkımızda',
    description: 'Hakkımızda sayfasının tüm bölümleri ve ekip listesi.',
    live: '/about',
    sections: [
      { key: 'hero',    title: 'Hero', description: 'Sayfa üstündeki tanıtım.', icon: '🎯', type: 'block-text-only' },
      { key: 'story',   title: 'Hikayemiz', description: 'Klinik hikayesi.', icon: '📖', type: 'block-text-only' },
      { key: 'mission', title: 'Misyon', description: 'Misyon ve değerler.', icon: '🎯', type: 'block-text-only' },
      {
        key: 'team',
        title: 'Ekibimiz',
        description: 'Ekip üyeleri listesi.',
        icon: '👥',
        type: 'collection',
        collection: {
          table: 'team_members',
          adminBase: '/admin/team',
          primaryField: 'name',
          secondaryField: 'title',
          imageField: 'image_url',
        },
      },
    ],
  },
  services: {
    title: 'Hizmetler Sayfası',
    description: 'Hizmetler ana sayfasının hero metni ve tüm hizmetlerin listesi.',
    live: '/services',
    sections: [
      { key: 'hero', title: 'Hero', description: 'Hizmetler sayfasının üstündeki tanıtım.', icon: '🎯', type: 'block-text-only' },
      {
        key: 'list',
        title: 'Tüm Hizmetler',
        description: 'Sitenin tüm hizmet sayfaları. Her satır kendi detay sayfasına bağlanır.',
        icon: '⚕️',
        type: 'collection',
        collection: {
          table: 'services',
          adminBase: '/admin/services',
          primaryField: 'title',
          secondaryField: 'short_description',
          imageField: 'image_url',
        },
      },
    ],
  },
  gallery: {
    title: 'Öncesi & Sonrası Sayfası',
    description: 'Galeri ana sayfasının hero metni ve tüm vakalar.',
    live: '/gallery',
    sections: [
      { key: 'hero', title: 'Hero', description: 'Galeri sayfasının üstündeki tanıtım.', icon: '🎯', type: 'block-text-only' },
      {
        key: 'cases',
        title: 'Tüm Vakalar',
        description: 'Galeride yer alan tüm öncesi/sonrası vakaları.',
        icon: '🖼',
        type: 'collection',
        collection: {
          table: 'gallery',
          adminBase: '/admin/gallery',
          primaryField: 'patient_code',
          secondaryField: 'technique',
          imageField: 'after_image_url',
        },
      },
    ],
  },
  blog: {
    title: 'Blog',
    description: 'Blog ana sayfasının hero metni ve tüm yazılar.',
    live: '/blog',
    sections: [
      { key: 'hero', title: 'Hero', description: 'Blog ana sayfasının üstündeki tanıtım.', icon: '🎯', type: 'block-text-only' },
      {
        key: 'posts',
        title: 'Tüm Blog Yazıları',
        description: 'Sitedeki blog yazıları.',
        icon: '✍️',
        type: 'collection',
        collection: {
          table: 'blog_posts',
          adminBase: '/admin/blog',
          primaryField: 'title',
          secondaryField: 'excerpt',
          imageField: 'image_url',
        },
      },
    ],
  },
  contact: {
    title: 'İletişim Sayfası',
    description: 'İletişim sayfasının metinleri.',
    live: '/contact',
    sections: [
      { key: 'hero',    title: 'Hero', description: 'Sayfa üstündeki tanıtım.', icon: '🎯', type: 'block-text-only' },
      { key: 'contact', title: 'İletişim Bilgileri', description: 'Adres / telefon / form tanıtımı.', icon: '✉️', type: 'block-text-only' },
    ],
  },
};
