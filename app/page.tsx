import Link from "next/link";
import { Award, BadgeCheck, CalendarCheck, Globe2, MapPinned, ShieldCheck, SlidersHorizontal, UsersRound } from "lucide-react";
import { GuideCard } from "@/components/GuideCard";
import { HomeSearch } from "@/components/HomeSearch";
import { TourCard } from "@/components/TourCard";
import { prisma } from "@/lib/prisma";
import { serializeGuide, serializeTour } from "@/lib/serializers";

async function getHomeData() {
  try {
    const [tours, guides] = await Promise.all([
      prisma.tour.findMany({
        take: 6,
        orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
        include: { guide: true }
      }),
      prisma.guide.findMany({
        take: 4,
        orderBy: [{ rating: "desc" }, { completedTours: "desc" }]
      })
    ]);

    return {
      tours: tours.map(serializeTour),
      guides: guides.map(serializeGuide)
    };
  } catch {
    return { tours: [], guides: [] };
  }
}

const advantages = [
  {
    icon: ShieldCheck,
    title: "Проверенные сертификаты",
    text: "У каждого специалиста хранится номер, дата выдачи и организация, выдавшая сертификат."
  },
  {
    icon: SlidersHorizontal,
    title: "Поиск по параметрам",
    text: "Фильтры по стране, городу, цене, рейтингу, языку, длительности и категории маршрута."
  },
  {
    icon: MapPinned,
    title: "Реальные маршруты",
    text: "Экскурсии привязаны к конкретным местам, координатам и точкам на OpenStreetMap."
  },
  {
    icon: CalendarCheck,
    title: "Быстрая заявка",
    text: "Форма бронирования рассчитывает итоговую стоимость и сохраняет заявку в личном кабинете."
  }
];

export default async function HomePage() {
  const { tours, guides } = await getHomeData();

  return (
    <>
      <section
        className="relative isolate min-h-[720px] bg-slate-950 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('https://source.unsplash.com/1800x1100/?travel,guide,city')" }}
      >
        <div className="absolute inset-0 -z-10 bg-slate-950/65" />
        <div className="container-page flex min-h-[720px] flex-col justify-center gap-8 py-12">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-semibold backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-emerald-300" />
              Сертифицированные экскурсоводы и специалисты
            </div>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">RouteCert</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              Веб-сервис для поиска и бронирования экскурсий с проверенными гидами в Казани, Москве,
              Санкт-Петербурге, на Байкале, в Тбилиси и Дубае.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/catalog" className="btn-primary bg-white text-slate-950 hover:bg-slate-100">
                Перейти в каталог
              </Link>
              <Link href="/booking" className="btn-secondary border-white/40 bg-white/10 text-white hover:bg-white hover:text-slate-950">
                Забронировать экскурсию
              </Link>
            </div>
          </div>
          <HomeSearch />
          <div className="grid max-w-4xl gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white/12 p-4 backdrop-blur">
              <div className="text-3xl font-bold">21</div>
              <div className="text-sm text-slate-200">демо-экскурсий</div>
            </div>
            <div className="rounded-lg bg-white/12 p-4 backdrop-blur">
              <div className="text-3xl font-bold">9</div>
              <div className="text-sm text-slate-200">специалистов</div>
            </div>
            <div className="rounded-lg bg-white/12 p-4 backdrop-blur">
              <div className="text-3xl font-bold">6</div>
              <div className="text-sm text-slate-200">направлений</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="section-title">Популярные экскурсии</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Подборка маршрутов с высоким рейтингом и реальными достопримечательностями.
            </p>
          </div>
          <Link href="/catalog" className="btn-secondary w-fit">
            Все экскурсии
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <div className="mb-8 max-w-3xl">
            <h2 className="section-title">Как сервис помогает выбрать экскурсию</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Проект демонстрирует полный путь пользователя: поиск, сравнение, проверка специалиста,
              расчет стоимости, бронирование и просмотр заявки в личном кабинете.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {advantages.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-slate-200 bg-mist p-5">
                  <Icon className="mb-4 h-7 w-7 text-brand" />
                  <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="section-title">Сертифицированные специалисты</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              В профиле гида есть опыт, языки, специализация, номер сертификата, организация выдачи и отзывы.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2">
              <Award className="h-4 w-4 text-ember" />
              лицензии и аккредитации
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2">
              <Globe2 className="h-4 w-4 text-brand" />
              несколько языков
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2">
              <UsersRound className="h-4 w-4 text-coral" />
              реальные отзывы
            </span>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </section>
    </>
  );
}
