import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { TOUR_ASSETS_BY_SLUG } from "../lib/tour-assets";

const databaseUrl = process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), "prisma", "dev.db")}`;

const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl } }
});

const demoUserId = "demo-user";

function tourAsset(slug: string, name: "cover" | "route-1" | "route-2") {
  return `/images/tours/${slug}-${name}.jpg`;
}

function guideAsset(slug: string) {
  return `/images/guides/${slug}.jpg`;
}

const GUIDE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%23e2e8f0'/%3E%3Ccircle cx='320' cy='246' r='122' fill='%2394a3b8'/%3E%3Cpath d='M128 560c24-108 110-182 192-182s168 74 192 182' fill='%2394a3b8'/%3E%3C/svg%3E";


function issued(value: string) {
  return new Date(`${value}T09:00:00.000Z`);
}

async function main() {
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: demoUserId,
      name: "Виталий Новиков",
      email: "demo@routecert.local",
      phone: "+7 900 123-45-67",
      city: "Казань"
    }
  });

  await prisma.city.createMany({
    data: [
      { country: "Россия", name: "Казань", region: "Республика Татарстан", latitude: 55.7961, longitude: 49.1064 },
      { country: "Россия", name: "Москва", region: "Москва", latitude: 55.7558, longitude: 37.6173 },
      { country: "Россия", name: "Санкт-Петербург", region: "Санкт-Петербург", latitude: 59.9343, longitude: 30.3351 },
      { country: "Россия", name: "Байкал", region: "Иркутская область и Республика Бурятия", latitude: 53.5587, longitude: 108.165 },
      { country: "Грузия", name: "Тбилиси", region: "Тбилиси и Мцхета-Мтианети", latitude: 41.7151, longitude: 44.8271 },
      { country: "ОАЭ", name: "Дубай", region: "Эмират Дубай", latitude: 25.2048, longitude: 55.2708 },
      { country: "Швейцария", name: "Цюрих", region: "Кантон Цюрих", latitude: 47.3769, longitude: 8.5417 },
      { country: "Швейцария", name: "Люцерн", region: "Кантон Люцерн", latitude: 47.0502, longitude: 8.3093 },
      { country: "Швейцария", name: "Интерлакен", region: "Кантон Берн", latitude: 46.6863, longitude: 7.8632 },
      { country: "Швейцария", name: "Женева", region: "Кантон Женева", latitude: 46.2044, longitude: 6.1432 },
      { country: "Германия", name: "Берлин", region: "Берлин", latitude: 52.52, longitude: 13.405 },
      { country: "Германия", name: "Мюнхен", region: "Бавария", latitude: 48.1351, longitude: 11.582 },
      { country: "Германия", name: "Нойшванштайн", region: "Бавария", latitude: 47.5576, longitude: 10.7498 },
      { country: "Германия", name: "Дрезден", region: "Саксония", latitude: 51.0504, longitude: 13.7373 },
      { country: "Япония", name: "Токио", region: "Токио", latitude: 35.6762, longitude: 139.6503 },
      { country: "Япония", name: "Киото", region: "Кансай", latitude: 35.0116, longitude: 135.7681 },
      { country: "Япония", name: "Нара", region: "Кансай", latitude: 34.6851, longitude: 135.8048 },
      { country: "Япония", name: "Хаконе", region: "Фудзи / Хаконе", latitude: 35.2324, longitude: 139.1069 },
      { country: "Япония", name: "Осака", region: "Кансай", latitude: 34.6937, longitude: 135.5023 },
      { country: "Япония", name: "Хиросима", region: "Хиросима / Миядзима", latitude: 34.3853, longitude: 132.4553 },
      { country: "Япония", name: "Камакура", region: "Канто", latitude: 35.3192, longitude: 139.5467 },
      { country: "Япония", name: "Никко", region: "Тотиги", latitude: 36.7581, longitude: 139.5989 },
      { country: "Китай", name: "Пекин", region: "Пекин", latitude: 39.9042, longitude: 116.4074 },
      { country: "Китай", name: "Мутяньюй", region: "Пекин / Мутяньюй", latitude: 40.4319, longitude: 116.5704 },
      { country: "Китай", name: "Шанхай", region: "Шанхай", latitude: 31.2304, longitude: 121.4737 },
      { country: "Китай", name: "Сиань", region: "Шэньси", latitude: 34.3416, longitude: 108.9398 },
    ]
  });

  const guides = [
    {
      slug: "aigul-safina",
      name: "Айгуль Сафина",
      photo: guideAsset("aigul-safina"),
      country: "Россия",
      city: "Казань",
      experienceYears: 9,
      specialization: "История Казани, исламская архитектура, татарская культура",
      languages: "Русский, English, Татарский",
      rating: 4.9,
      completedTours: 1240,
      certificateNumber: "РТ-ГИД-2021-0448",
      certificateIssuedAt: issued("2021-04-10"),
      certificateIssuer: "Государственный комитет Республики Татарстан по туризму",
      bio: "Проводит авторские маршруты по Казанскому кремлю, Старо-Татарской слободе и объектам ЮНЕСКО. Делает акцент на проверенных исторических источниках и комфортном темпе группы."
    },
    {
      slug: "timur-galeev",
      name: "Тимур Галеев",
      photo: guideAsset("timur-galeev"),
      country: "Россия",
      city: "Казань",
      experienceYears: 7,
      specialization: "Природные маршруты Татарстана и выездные экскурсии",
      languages: "Русский, English",
      rating: 4.8,
      completedTours: 860,
      certificateNumber: "РТ-ЭКО-2022-0191",
      certificateIssuedAt: issued("2022-06-03"),
      certificateIssuer: "Ассоциация экскурсоводов Республики Татарстан",
      bio: "Специализируется на маршрутах к Голубым озерам, Свияжску и Раифскому монастырю. Следит за безопасностью на природных участках и заранее проверяет логистику."
    },
    {
      slug: "maria-volkova",
      name: "Мария Волкова",
      photo: guideAsset("maria-volkova"),
      country: "Россия",
      city: "Москва",
      experienceYears: 11,
      specialization: "Музейные маршруты, русское искусство, городская история",
      languages: "Русский, English, Français",
      rating: 4.95,
      completedTours: 1515,
      certificateNumber: "МСК-ИСК-2020-1120",
      certificateIssuedAt: issued("2020-09-18"),
      certificateIssuer: "Департамент культуры города Москвы",
      bio: "Искусствовед и аккредитованный московский экскурсовод. Помогает увидеть знакомые музеи и площади через детали, которые обычно остаются вне маршрута."
    },
    {
      slug: "alexey-orlov",
      name: "Алексей Орлов",
      photo: guideAsset("alexey-orlov"),
      country: "Россия",
      city: "Москва",
      experienceYears: 8,
      specialization: "Советская архитектура, подземные объекты, городские легенды",
      languages: "Русский, English",
      rating: 4.82,
      completedTours: 930,
      certificateNumber: "МСК-ГИД-2022-0317",
      certificateIssuedAt: issued("2022-02-12"),
      certificateIssuer: "Московская ассоциация гидов-переводчиков",
      bio: "Ведет маршруты по ВДНХ, Останкино, Коломенскому и Бункеру-42. Сочетает факты, архивные материалы и понятный рассказ без перегруза датами."
    },
    {
      slug: "ekaterina-lebedeva",
      name: "Екатерина Лебедева",
      photo: guideAsset("ekaterina-lebedeva"),
      country: "Россия",
      city: "Санкт-Петербург",
      experienceYears: 12,
      specialization: "Эрмитаж, барокко, музейные коллекции Петербурга",
      languages: "Русский, English, Deutsch",
      rating: 4.97,
      completedTours: 1740,
      certificateNumber: "СПБ-МУЗ-2019-0822",
      certificateIssuedAt: issued("2019-05-14"),
      certificateIssuer: "Комитет по развитию туризма Санкт-Петербурга",
      bio: "Профессиональный музейный гид. Строит экскурсии по Эрмитажу так, чтобы группа понимала логику коллекций, а не просто проходила от шедевра к шедевру."
    },
    {
      slug: "dmitry-kovalev",
      name: "Дмитрий Ковалев",
      photo: guideAsset("dmitry-kovalev"),
      country: "Россия",
      city: "Санкт-Петербург",
      experienceYears: 10,
      specialization: "Архитектура Петербурга, крепости, водные маршруты",
      languages: "Русский, English",
      rating: 4.86,
      completedTours: 1190,
      certificateNumber: "СПБ-ГИД-2021-0506",
      certificateIssuedAt: issued("2021-08-07"),
      certificateIssuer: "Туристско-информационное бюро Санкт-Петербурга",
      bio: "Проводит прогулки по Петропавловской крепости, Невскому проспекту и ночным мостам. Умеет адаптировать сложную архитектурную тему для семейных групп."
    },
    {
      slug: "artem-buryatov",
      name: "Артем Бурятов",
      photo: guideAsset("artem-buryatov"),
      country: "Россия",
      city: "Байкал",
      experienceYears: 13,
      specialization: "Байкал, этнокультурные маршруты Бурятии, безопасный трекинг",
      languages: "Русский, English",
      rating: 4.91,
      completedTours: 980,
      certificateNumber: "БКЛ-ЭКО-2018-0074",
      certificateIssuedAt: issued("2018-07-22"),
      certificateIssuer: "Ассоциация гидов Байкальского региона",
      bio: "Организует маршруты по Ольхону, Листвянке, КБЖД и Бурятии. Делает упор на ответственное посещение природных территорий и местные традиции."
    },
    {
      slug: "nino-chavchavadze",
      name: "Нино Чавчавадзе",
      photo: guideAsset("nino-chavchavadze"),
      country: "Грузия",
      city: "Тбилиси",
      experienceYears: 8,
      specialization: "Старый Тбилиси, Сололаки, винная и культурная история",
      languages: "Русский, English, ქართული",
      rating: 4.88,
      completedTours: 1035,
      certificateNumber: "GTA-TBS-2021-209",
      certificateIssuedAt: issued("2021-03-16"),
      certificateIssuer: "Georgian Tourism Association",
      bio: "Рассказывает о Тбилиси через дворы, балконы, серные бани и старые городские семьи. Хорошо знает маршруты для первого знакомства и повторных поездок."
    },
    {
      slug: "omar-al-mansouri",
      name: "Omar Al Mansouri",
      photo: guideAsset("omar-al-mansouri"),
      country: "ОАЭ",
      city: "Дубай",
      experienceYears: 9,
      specialization: "Современный Дубай, исторический Al Fahidi, пустынные маршруты",
      languages: "English, Русский, العربية",
      rating: 4.84,
      completedTours: 1120,
      certificateNumber: "DTCM-LG-2020-5831",
      certificateIssuedAt: issued("2020-11-25"),
      certificateIssuer: "Dubai Department of Economy and Tourism",
      bio: "Лицензированный гид Дубая с опытом городских и пустынных программ. Следит за таймингом, погодой и комфортом группы в жарком климате."
    },
    {
      slug: "lukas-meier",
      name: "Lukas Meier",
      photo: "/images/guides/lukas-meier.png",
      country: "Швейцария",
      city: "Цюрих / Люцерн",
      experienceYears: 9,
      specialization: "Старые города Швейцарии, история, архитектура, Альпы",
      languages: "Deutsch, English, Français",
      rating: 4.9,
      completedTours: 980,
      certificateNumber: "CH-GUIDE-2021-304",
      certificateIssuedAt: issued("2021-04-18"),
      certificateIssuer: "Swiss Tour Guides Association",
      bio: "Проводит авторские маршруты по Цюриху и Люцерну, сочетая городскую историю с альпийскими панорамами. Помогает гостям понимать местную архитектуру и культурные различия между регионами Швейцарии."
    },
    {
      slug: "anna-keller",
      name: "Anna Keller",
      photo: "/images/guides/anna-keller.png",
      country: "Швейцария",
      city: "Женева / Интерлакен",
      experienceYears: 8,
      specialization: "Международная Женева, Альпы, природные маршруты, озёра Швейцарии",
      languages: "Deutsch, English, Français",
      rating: 4.9,
      completedTours: 870,
      certificateNumber: "CH-ALPS-2020-118",
      certificateIssuedAt: issued("2020-09-12"),
      certificateIssuer: "Swiss Tourism Federation",
      bio: "Организует экскурсии между Женевой и Интерлакеном с акцентом на природные локации и озёрные маршруты. Отлично адаптирует программы для семей и путешественников, впервые приехавших в Альпы."
    },
    {
      slug: "hans-muller",
      name: "Hans Müller",
      photo: "/images/guides/hans-muller.png",
      country: "Германия",
      city: "Берлин",
      experienceYears: 10,
      specialization: "История Берлина, XX век, музеи, Берлинская стена",
      languages: "Deutsch, English, Русский",
      rating: 4.9,
      completedTours: 1120,
      certificateNumber: "DE-BER-2021-442",
      certificateIssuedAt: issued("2021-06-05"),
      certificateIssuer: "Berlin Guide Association",
      bio: "Специализируется на маршрутах по ключевым местам Берлина XX века: от музейного острова до следов Берлинской стены. Структурирует сложный исторический материал так, чтобы он был понятен без предварительной подготовки."
    },
    {
      slug: "sophie-schneider",
      name: "Sophie Schneider",
      photo: "/images/guides/sophie-schneider.png",
      country: "Германия",
      city: "Мюнхен / Бавария",
      experienceYears: 7,
      specialization: "Бавария, замки, гастрономия, старые города Германии",
      languages: "Deutsch, English",
      rating: 4.8,
      completedTours: 790,
      certificateNumber: "DE-BAV-2022-216",
      certificateIssuedAt: issued("2022-03-22"),
      certificateIssuer: "Bavarian Tour Guides Guild",
      bio: "Проводит экскурсии по Мюнхену и Баварии с фокусом на исторические центры, замки и региональные гастрономические традиции. Уделяет внимание логистике, чтобы насыщенные выездные дни проходили комфортно."
    },
    {
      slug: "haruto-tanaka",
      name: "Haruto Tanaka",
      photo: "/images/guides/haruto-tanaka.png",
      country: "Япония",
      city: "Токио",
      experienceYears: 8,
      specialization: "Современная Япония, городская культура, храмы Токио, Асакуса, Сибуя",
      languages: "Japanese, English",
      rating: 4.9,
      completedTours: 940,
      certificateNumber: "JP-TYO-2021-507",
      certificateIssuedAt: issued("2021-05-14"),
      certificateIssuer: "Japan Federation of Certified Guides",
      bio: "Ведёт городские маршруты по Токио, где соединяет динамику современных кварталов и историю храмов. Особенно популярен формат прогулок Асакуса—Сибуя с разбором городской культуры и повседневных традиций."
    },
    {
      slug: "aiko-nakamura",
      name: "Aiko Nakamura",
      photo: "/images/guides/aiko-nakamura.png",
      country: "Япония",
      city: "Киото / Нара",
      experienceYears: 9,
      specialization: "Традиционная культура, храмы, сады, чайные кварталы, Нара",
      languages: "Japanese, English",
      rating: 5,
      completedTours: 1050,
      certificateNumber: "JP-KYO-2020-331",
      certificateIssuedAt: issued("2020-10-08"),
      certificateIssuer: "Kyoto Licensed Guide Association",
      bio: "Специалист по культурному наследию Киото и Нары: храмовым ансамблям, садам и историческим кварталам. Делает акцент на этикете посещения святынь и контексте японских сезонных традиций."
    },
    {
      slug: "ren-sato",
      name: "Ren Sato",
      photo: "/images/guides/ren-sato.png",
      country: "Япония",
      city: "Осака / Хиросима / Камакура / Никко",
      experienceYears: 7,
      specialization: "Гастрономические маршруты, исторические выездные экскурсии, святилища, городская культура",
      languages: "Japanese, English",
      rating: 4.8,
      completedTours: 820,
      certificateNumber: "JP-KANSAI-2022-614",
      certificateIssuedAt: issued("2022-07-19"),
      certificateIssuer: "Japan National Tourism Organization Guide Registry",
      bio: "Сопровождает мультигородские программы по Кансаю и соседним регионам, сочетая локальную кухню и исторические локации. Помогает выстраивать маршрут так, чтобы в одной поездке увидеть разные стороны Японии."
    },
    {
      slug: "li-wei",
      name: "Li Wei",
      photo: "/images/guides/li-wei.png",
      country: "Китай",
      city: "Пекин",
      experienceYears: 9,
      specialization: "Императорский Китай, Запретный город, Великая Китайская стена",
      languages: "Chinese, English",
      rating: 4.9,
      completedTours: 990,
      certificateNumber: "CN-BJS-2021-884",
      certificateIssuedAt: issued("2021-08-11"),
      certificateIssuer: "Beijing Licensed Tour Guide Center",
      bio: "Эксперт по императорской истории Пекина и главным памятникам эпох Мин и Цин. На маршрутах сочетает исторические факты с практическими рекомендациями по посещению самых загруженных локаций."
    },
    {
      slug: "chen-mei",
      name: "Chen Mei",
      photo: "/images/guides/chen-mei.png",
      country: "Китай",
      city: "Шанхай / Сиань",
      experienceYears: 8,
      specialization: "Архитектура Китая, музеи, древние столицы, Шанхай и Терракотовая армия",
      languages: "Chinese, English",
      rating: 4.8,
      completedTours: 910,
      certificateNumber: "CN-SHA-2022-159",
      certificateIssuedAt: issued("2022-02-16"),
      certificateIssuer: "China Tourism Guide Association",
      bio: "Проводит экскурсии в Шанхае и Сиане, объясняя эволюцию китайской архитектуры от древних столиц до современного мегаполиса. Подходит для гостей, которым важны музеи и глубокий исторический контекст."
    }
  ];

  for (const guide of guides) {
    await prisma.guide.create({ data: guide });
  }

  const guideMap = Object.fromEntries((await prisma.guide.findMany()).map((guide) => [guide.slug, guide]));

  const tours = [
    {
      slug: "kazan-kremlin-kul-sharif",
      guideSlug: "aigul-safina",
      title: "Казанский кремль и мечеть Кул-Шариф",
      country: "Россия",
      city: "Казань",
      region: "Республика Татарстан",
      category: "Историческая",
      description: "Маршрут по объекту ЮНЕСКО с акцентом на историю Казанского ханства, православные и исламские памятники.",
      longDescription: "Экскурсия знакомит с ключевыми символами Казани: Спасской башней, Благовещенским собором, мечетью Кул-Шариф и смотровыми площадками кремля. Гид объясняет, как менялся город после XVI века и почему территория кремля стала точкой встречи разных культур.",
      price: 3500,
      currency: "RUB",
      durationHours: 3,
      rating: 4.9,
      reviewCount: 164,
      language: "Русский",
      maxGroupSize: 12,
      image: "",
      meetingPoint: "Спасская башня Казанского кремля",
      latitude: 55.7989,
      longitude: 49.1059,
      route: [
        { title: "Спасская башня", lat: 55.7976, lon: 49.1063, note: "Вход на территорию кремля" },
        { title: "Мечеть Кул-Шариф", lat: 55.7987, lon: 49.1055, note: "Архитектура и современная роль мечети" },
        { title: "Благовещенский собор", lat: 55.7995, lon: 49.1069, note: "Православное наследие кремля" }
      ],
      program: ["Сбор у Спасской башни и вводная по истории города", "Прогулка по кремлевским стенам и смотровым точкам", "Посещение территории мечети Кул-Шариф", "Разбор архитектурных слоев кремля и ответы на вопросы"],
      gallery: ["", "", ""]
    },
    {
      slug: "sviyazhsk-raifa-day-trip",
      guideSlug: "timur-galeev",
      title: "Свияжск и Раифский монастырь за один день",
      country: "Россия",
      city: "Казань",
      region: "Республика Татарстан",
      category: "Выездная",
      description: "Однодневный маршрут к острову-граду Свияжску и Раифскому Богородицкому монастырю с трансфером.",
      longDescription: "Маршрут подходит для тех, кто хочет увидеть исторические окрестности Казани без самостоятельной логистики. В программе остров-град Свияжск, деревянная Троицкая церковь, панорамы Волги и Раифский Богородицкий монастырь у озера.",
      price: 8500,
      currency: "RUB",
      durationHours: 8,
      rating: 4.84,
      reviewCount: 97,
      language: "Русский",
      maxGroupSize: 6,
      image: "",
      meetingPoint: "Центр семьи «Казан»",
      latitude: 55.7714,
      longitude: 48.6597,
      route: [
        { title: "Центр семьи «Казан»", lat: 55.8169, lon: 49.1088, note: "Старт и посадка в минивэн" },
        { title: "Остров-град Свияжск", lat: 55.7714, lon: 48.6597, note: "Пешеходная экскурсия по острову" },
        { title: "Раифский монастырь", lat: 55.9026, lon: 48.7293, note: "История обители и озерные виды" }
      ],
      program: ["Выезд из Казани и рассказ о Волге", "Пешеходный маршрут по Свияжску", "Время на обед в локальном кафе", "Посещение Раифского монастыря", "Возвращение в Казань"],
      gallery: ["", "", ""]
    },
    {
      slug: "blue-lakes-temple-all-religions",
      guideSlug: "timur-galeev",
      title: "Голубые озера и Храм всех религий",
      country: "Россия",
      city: "Казань",
      region: "Республика Татарстан",
      category: "Природная",
      description: "Комбинация природного маршрута к Голубым озерам и необычной архитектуры Храма всех религий.",
      longDescription: "За полдня участники увидят прозрачные карстовые озера под Казанью, узнают о правилах посещения природной территории и посетят Храм всех религий как яркий пример авторской архитектуры Татарстана.",
      price: 6200,
      currency: "RUB",
      durationHours: 5,
      rating: 4.78,
      reviewCount: 73,
      language: "Русский",
      maxGroupSize: 8,
      image: "",
      meetingPoint: "Станция метро Козья Слобода",
      latitude: 55.873,
      longitude: 49.153,
      route: [
        { title: "Голубые озера", lat: 55.873, lon: 49.153, note: "Карстовые источники и прогулочная тропа" },
        { title: "Храм всех религий", lat: 55.8016, lon: 48.9717, note: "Осмотр фасадов и история проекта" }
      ],
      program: ["Переезд к Голубым озерам", "Прогулка по безопасной тропе и фото-паузы", "Переезд к Храму всех религий", "Обсуждение идеи культурного синтеза"],
      gallery: ["", "", ""]
    },
    {
      slug: "moscow-red-square-kremlin",
      guideSlug: "maria-volkova",
      title: "Красная площадь и тайны Московского Кремля",
      country: "Россия",
      city: "Москва",
      region: "Москва",
      category: "Историческая",
      description: "Классический маршрут по центру Москвы с профессиональным разбором символов Красной площади и Кремля.",
      longDescription: "Экскурсия проходит вокруг Красной площади, Александровского сада и кремлевских стен. Гид объясняет, как формировался политический и торговый центр Москвы, где находятся ключевые панорамные точки и какие детали помогают читать городскую историю.",
      price: 4200,
      currency: "RUB",
      durationHours: 3,
      rating: 4.91,
      reviewCount: 212,
      language: "Русский",
      maxGroupSize: 15,
      image: "",
      meetingPoint: "Памятник маршалу Жукову",
      latitude: 55.7539,
      longitude: 37.6208,
      route: [
        { title: "Красная площадь", lat: 55.7539, lon: 37.6208, note: "Историческая площадь и торговые ряды" },
        { title: "Московский Кремль", lat: 55.752, lon: 37.6175, note: "Крепостные стены и башни" },
        { title: "Александровский сад", lat: 55.7525, lon: 37.6135, note: "Мемориальные пространства центра" }
      ],
      program: ["Встреча у Исторического музея", "Красная площадь и ГУМ", "Внешний контур Кремля", "Александровский сад и Манежная площадь"],
      gallery: ["", "", ""]
    },
    {
      slug: "tretyakov-gallery-art",
      guideSlug: "maria-volkova",
      title: "Третьяковская галерея с искусствоведом",
      country: "Россия",
      city: "Москва",
      region: "Москва",
      category: "Музейная",
      description: "Маршрут по ключевым залам Третьяковской галереи: от древнерусской иконы до передвижников.",
      longDescription: "Экскурсия помогает выстроить целостную линию развития русского искусства. Вместо простого перечисления картин гид объясняет контекст эпох, художественные приемы и причины, по которым работы стали знаковыми.",
      price: 3800,
      currency: "RUB",
      durationHours: 2.5,
      rating: 4.96,
      reviewCount: 185,
      language: "Русский",
      maxGroupSize: 10,
      image: "",
      meetingPoint: "Вход в Третьяковскую галерею в Лаврушинском переулке",
      latitude: 55.7414,
      longitude: 37.6208,
      route: [
        { title: "Лаврушинский переулок", lat: 55.7414, lon: 37.6208, note: "История коллекции Павла Третьякова" },
        { title: "Залы иконописи", lat: 55.7414, lon: 37.6208, note: "Древнерусское искусство" },
        { title: "Залы XIX века", lat: 55.7414, lon: 37.6208, note: "Передвижники и реализм" }
      ],
      program: ["История галереи и коллекционера", "Древнерусская икона", "Брюллов, Иванов и Суриков", "Передвижники и художественные споры XIX века"],
      gallery: ["", "", ""]
    },
    {
      slug: "vdnh-ostankino-soviet-modern",
      guideSlug: "alexey-orlov",
      title: "ВДНХ, Останкинская телебашня и павильоны",
      country: "Россия",
      city: "Москва",
      region: "Москва",
      category: "Обзорная",
      description: "Архитектурная прогулка по ВДНХ с финалом у Останкинской телебашни.",
      longDescription: "Маршрут показывает ВДНХ как большой музей советской и постсоветской архитектуры под открытым небом. Участники увидят центральные павильоны, фонтан «Дружба народов», узнают о реставрации территории и подойдут к Останкинской телебашне.",
      price: 5000,
      currency: "RUB",
      durationHours: 4,
      rating: 4.74,
      reviewCount: 88,
      language: "Русский",
      maxGroupSize: 14,
      image: "",
      meetingPoint: "Арка главного входа ВДНХ",
      latitude: 55.8298,
      longitude: 37.6335,
      route: [
        { title: "Главный вход ВДНХ", lat: 55.8298, lon: 37.6335, note: "Композиция выставочного ансамбля" },
        { title: "Фонтан «Дружба народов»", lat: 55.8326, lon: 37.6295, note: "Символика союзных республик" },
        { title: "Останкинская телебашня", lat: 55.8197, lon: 37.6117, note: "Инженерная доминанта района" }
      ],
      program: ["История выставки и главный вход", "Центральная аллея и павильоны", "Фонтанные площади", "Переход к Останкинской телебашне"],
      gallery: ["", "", ""]
    },
    {
      slug: "bunker-42-underground-moscow",
      guideSlug: "alexey-orlov",
      title: "Бункер-42 и подземная Москва",
      country: "Россия",
      city: "Москва",
      region: "Москва",
      category: "Авторская",
      description: "Маршрут по теме холодной войны с посещением района Таганки и историей подземных объектов.",
      longDescription: "Экскурсия объединяет городскую прогулку по Таганке и рассказ о Бункере-42 как памятнике эпохи холодной войны. Подходит тем, кто интересуется инженерией, закрытыми объектами и историей XX века.",
      price: 4700,
      currency: "RUB",
      durationHours: 3,
      rating: 4.79,
      reviewCount: 62,
      language: "Русский",
      maxGroupSize: 10,
      image: "",
      meetingPoint: "Метро Таганская, кольцевая линия",
      latitude: 55.7417,
      longitude: 37.6536,
      route: [
        { title: "Таганская площадь", lat: 55.7417, lon: 37.6536, note: "Городской контекст района" },
        { title: "Бункер-42", lat: 55.7412, lon: 37.6516, note: "Подземный объект холодной войны" }
      ],
      program: ["Встреча на Таганке", "История района и послевоенной Москвы", "Посещение Бункера-42", "Обсуждение инженерных решений и гражданской обороны"],
      gallery: ["", "", ""]
    },
    {
      slug: "hermitage-masterpieces",
      guideSlug: "ekaterina-lebedeva",
      title: "Эрмитаж: главные залы и скрытые сюжеты",
      country: "Россия",
      city: "Санкт-Петербург",
      region: "Санкт-Петербург",
      category: "Музейная",
      description: "Продуманный маршрут по Эрмитажу без перегруза: парадные залы, европейская живопись и история дворца.",
      longDescription: "Гид выстраивает посещение Эрмитажа как связный рассказ: от Зимнего дворца и парадной анфилады до ключевых произведений европейской живописи. Экскурсия рассчитана на тех, кто хочет понять музей, а не просто увидеть список экспонатов.",
      price: 5200,
      currency: "RUB",
      durationHours: 3,
      rating: 4.98,
      reviewCount: 240,
      language: "Русский",
      maxGroupSize: 8,
      image: "",
      meetingPoint: "Дворцовая площадь, у Александровской колонны",
      latitude: 59.9398,
      longitude: 30.3146,
      route: [
        { title: "Дворцовая площадь", lat: 59.939, lon: 30.3158, note: "История ансамбля" },
        { title: "Зимний дворец", lat: 59.9398, lon: 30.3146, note: "Парадные залы" },
        { title: "Европейская живопись", lat: 59.9398, lon: 30.3146, note: "Ключевые произведения маршрута" }
      ],
      program: ["Встреча на Дворцовой площади", "Парадная лестница и залы", "Итальянская и нидерландская живопись", "Финальный блок с вопросами"],
      gallery: ["", "", ""]
    },
    {
      slug: "peter-paul-fortress-history",
      guideSlug: "dmitry-kovalev",
      title: "Петропавловская крепость и рождение Петербурга",
      country: "Россия",
      city: "Санкт-Петербург",
      region: "Санкт-Петербург",
      category: "Историческая",
      description: "Прогулка по первой крепости города, собору, бастионам и панорамам Невы.",
      longDescription: "Экскурсия показывает, почему Петропавловская крепость стала точкой отсчета Петербурга. Участники увидят бастионы, собор, Невские ворота и узнают о военной, политической и мемориальной роли крепости.",
      price: 3900,
      currency: "RUB",
      durationHours: 2.5,
      rating: 4.83,
      reviewCount: 118,
      language: "Русский",
      maxGroupSize: 12,
      image: "",
      meetingPoint: "Иоанновский мост",
      latitude: 59.9501,
      longitude: 30.3166,
      route: [
        { title: "Иоанновский мост", lat: 59.9501, lon: 30.3166, note: "Вход на Заячий остров" },
        { title: "Петропавловский собор", lat: 59.9502, lon: 30.3163, note: "Императорская усыпальница" },
        { title: "Невские ворота", lat: 59.9491, lon: 30.3171, note: "Вид на Неву" }
      ],
      program: ["Старт у Иоанновского моста", "Бастионы и план крепости", "Собор и династическая история", "Панорамы Невы и финал маршрута"],
      gallery: ["", "", ""]
    },
    {
      slug: "night-bridges-canals",
      guideSlug: "dmitry-kovalev",
      title: "Каналы и разводные мосты Петербурга",
      country: "Россия",
      city: "Санкт-Петербург",
      region: "Санкт-Петербург",
      category: "Обзорная",
      description: "Вечерний маршрут по Невскому проспекту, набережным и точкам наблюдения за разводными мостами.",
      longDescription: "Маршрут рассчитан на вечернее знакомство с водным Петербургом. Гид объяснит, как каналы сформировали городскую ткань, покажет лучшие точки для фотографий и поможет спланировать наблюдение за разводными мостами.",
      price: 4400,
      currency: "RUB",
      durationHours: 3.5,
      rating: 4.8,
      reviewCount: 131,
      language: "Русский",
      maxGroupSize: 10,
      image: "",
      meetingPoint: "Казанский собор на Невском проспекте",
      latitude: 59.9343,
      longitude: 30.3351,
      route: [
        { title: "Невский проспект", lat: 59.9343, lon: 30.3351, note: "Главная городская ось" },
        { title: "Исаакиевский собор", lat: 59.9341, lon: 30.3061, note: "Площадь и силуэт города" },
        { title: "Дворцовый мост", lat: 59.9416, lon: 30.3086, note: "Точка наблюдения за разводкой" }
      ],
      program: ["Прогулка по Невскому проспекту", "Каналы и набережные", "Исаакиевская площадь", "Финал у Дворцового моста"],
      gallery: ["", "", ""]
    },
    {
      slug: "peterhof-fountains",
      guideSlug: "ekaterina-lebedeva",
      title: "Петергоф: фонтаны, парки и императорская резиденция",
      country: "Россия",
      city: "Санкт-Петербург",
      region: "Санкт-Петербург",
      category: "Семейная",
      description: "Выездная экскурсия в Петергоф с маршрутом по Нижнему парку и главному каскаду.",
      longDescription: "Экскурсия подойдет для первого знакомства с Петергофом. В программе история загородной резиденции, устройство фонтанной системы, Нижний парк, Большой каскад и время для самостоятельной прогулки.",
      price: 7600,
      currency: "RUB",
      durationHours: 6,
      rating: 4.87,
      reviewCount: 109,
      language: "Русский",
      maxGroupSize: 8,
      image: "",
      meetingPoint: "Метро Автово",
      latitude: 59.8845,
      longitude: 29.908,
      route: [
        { title: "Метро Автово", lat: 59.8675, lon: 30.2614, note: "Старт трансфера" },
        { title: "Нижний парк Петергофа", lat: 59.8845, lon: 29.908, note: "Фонтаны и парковая композиция" },
        { title: "Большой каскад", lat: 59.8849, lon: 29.9086, note: "Главная точка маршрута" }
      ],
      program: ["Переезд в Петергоф", "Вводная о резиденции", "Нижний парк и фонтаны", "Свободное время и возвращение"],
      gallery: ["", "", ""]
    },
    {
      slug: "olkhon-baikal-legends",
      guideSlug: "artem-buryatov",
      title: "Ольхон и шаманские легенды Байкала",
      country: "Россия",
      city: "Байкал",
      region: "Иркутская область",
      category: "Этнокультурная",
      description: "Маршрут по острову Ольхон с бухтами, смотровыми площадками и культурным контекстом Байкала.",
      longDescription: "Экскурсия знакомит с природой и культурой острова Ольхон. В программе мыс Бурхан, Хужир, береговые панорамы, разговор о бурятских традициях и бережном поведении на сакральных местах.",
      price: 12000,
      currency: "RUB",
      durationHours: 9,
      rating: 4.93,
      reviewCount: 91,
      language: "Русский",
      maxGroupSize: 6,
      image: "",
      meetingPoint: "Поселок Хужир, центральная площадь",
      latitude: 53.1939,
      longitude: 107.3375,
      route: [
        { title: "Хужир", lat: 53.1939, lon: 107.3375, note: "Старт на острове" },
        { title: "Мыс Бурхан", lat: 53.2042, lon: 107.3396, note: "Скала Шаманка" },
        { title: "Смотровые бухты Ольхона", lat: 53.2407, lon: 107.401, note: "Панорамы Байкала" }
      ],
      program: ["Сбор в Хужире", "Мыс Бурхан и правила посещения", "Переезды к бухтам и смотровым", "Локальный обед и возвращение"],
      gallery: ["", "", ""]
    },
    {
      slug: "listvyanka-circum-baikal-railway",
      guideSlug: "artem-buryatov",
      title: "Листвянка и Кругобайкальская железная дорога",
      country: "Россия",
      city: "Байкал",
      region: "Иркутская область",
      category: "Природная",
      description: "Знакомство с Байкалом через Листвянку, исток Ангары и инженерную историю КБЖД.",
      longDescription: "Маршрут объединяет природные точки Листвянки и рассказ о Кругобайкальской железной дороге. Участники увидят исток Ангары, берег Байкала, старые тоннели и узнают, почему КБЖД называют инженерным памятником.",
      price: 9800,
      currency: "RUB",
      durationHours: 7,
      rating: 4.81,
      reviewCount: 76,
      language: "Русский",
      maxGroupSize: 7,
      image: "",
      meetingPoint: "Иркутск, сквер Кирова",
      latitude: 51.8536,
      longitude: 104.8693,
      route: [
        { title: "Иркутск", lat: 52.2864, lon: 104.2807, note: "Старт маршрута" },
        { title: "Листвянка", lat: 51.8536, lon: 104.8693, note: "Берег Байкала" },
        { title: "КБЖД", lat: 51.8563, lon: 104.8756, note: "История железной дороги" }
      ],
      program: ["Выезд из Иркутска", "Листвянка и исток Ангары", "Байкальские панорамы", "Блок о Кругобайкальской железной дороге"],
      gallery: ["", "", ""]
    },
    {
      slug: "buryatia-ethno-route",
      guideSlug: "artem-buryatov",
      title: "Этнокультурная Бурятия: дацан и традиции",
      country: "Россия",
      city: "Байкал",
      region: "Республика Бурятия",
      category: "Этнокультурная",
      description: "Маршрут по Бурятии с посещением Иволгинского дацана и знакомством с местной культурой.",
      longDescription: "Программа строится вокруг уважительного знакомства с буддийской культурой Бурятии. Гид расскажет о роли Иволгинского дацана, местных традициях, кухне и особенностях маршрутов вокруг Байкала со стороны Улан-Удэ.",
      price: 11000,
      currency: "RUB",
      durationHours: 8,
      rating: 4.89,
      reviewCount: 54,
      language: "Русский",
      maxGroupSize: 6,
      image: "",
      meetingPoint: "Улан-Удэ, площадь Советов",
      latitude: 51.7586,
      longitude: 107.203,
      route: [
        { title: "Улан-Удэ", lat: 51.8335, lon: 107.5841, note: "Старт маршрута" },
        { title: "Иволгинский дацан", lat: 51.7586, lon: 107.203, note: "Буддийский комплекс" },
        { title: "Этнокультурная площадка", lat: 51.827, lon: 107.606, note: "Традиции и кухня" }
      ],
      program: ["Выезд из Улан-Удэ", "Иволгинский дацан и правила посещения", "Этнокультурный блок", "Возвращение в город"],
      gallery: ["", "", ""]
    },
    {
      slug: "old-tbilisi-narikala-baths",
      guideSlug: "nino-chavchavadze",
      title: "Старый Тбилиси, Нарикала и серные бани",
      country: "Грузия",
      city: "Тбилиси",
      region: "Тбилиси",
      category: "Историческая",
      description: "Первое знакомство с Тбилиси: старые кварталы, крепость Нарикала, серные бани и видовые точки.",
      longDescription: "Маршрут проходит по району Абанотубани, старым улицам, канатной дороге к Нарикале и смотровым площадкам. Гид рассказывает о грузинской городской культуре, торговых путях и том, почему Тбилиси сложился как многоязычный город.",
      price: 75,
      currency: "USD",
      durationHours: 3.5,
      rating: 4.9,
      reviewCount: 143,
      language: "Русский",
      maxGroupSize: 10,
      image: "",
      meetingPoint: "Площадь Мейдан",
      latitude: 41.6886,
      longitude: 44.8086,
      route: [
        { title: "Площадь Мейдан", lat: 41.6901, lon: 44.8087, note: "Старт в Старом Тбилиси" },
        { title: "Серные бани", lat: 41.6879, lon: 44.811, note: "История района Абанотубани" },
        { title: "Крепость Нарикала", lat: 41.6886, lon: 44.8086, note: "Панорама города" }
      ],
      program: ["Старые кварталы и дворы", "Серные бани и городские легенды", "Подъем к Нарикале", "Смотровые площадки и финал у канатной дороги"],
      gallery: ["", "", ""]
    },
    {
      slug: "sololaki-rustaveli-architecture",
      guideSlug: "nino-chavchavadze",
      title: "Сололаки и проспект Руставели: парадные Тбилиси",
      country: "Грузия",
      city: "Тбилиси",
      region: "Тбилиси",
      category: "Авторская",
      description: "Архитектурная прогулка по району Сололаки, подъездам, мозаикам и проспекту Руставели.",
      longDescription: "Экскурсия раскрывает Тбилиси через детали городских домов, лестниц, балконов и фасадов. Отдельный блок посвящен проспекту Руставели, театрам, культурным институциям и слоям городской памяти.",
      price: 68,
      currency: "USD",
      durationHours: 3,
      rating: 4.86,
      reviewCount: 79,
      language: "Русский",
      maxGroupSize: 8,
      image: "",
      meetingPoint: "Площадь Свободы",
      latitude: 41.6934,
      longitude: 44.8015,
      route: [
        { title: "Площадь Свободы", lat: 41.6934, lon: 44.8015, note: "Старт маршрута" },
        { title: "Сололаки", lat: 41.6908, lon: 44.7967, note: "Доходные дома и парадные" },
        { title: "Проспект Руставели", lat: 41.7006, lon: 44.7948, note: "Культурная ось города" }
      ],
      program: ["Площадь Свободы и городская планировка", "Сололаки: фасады и парадные", "Истории жителей района", "Проспект Руставели и театральный квартал"],
      gallery: ["", "", ""]
    },
    {
      slug: "mtskheta-day-trip",
      guideSlug: "nino-chavchavadze",
      title: "Мцхета: древняя столица Грузии",
      country: "Грузия",
      city: "Тбилиси",
      region: "Мцхета-Мтианети",
      category: "Выездная",
      description: "Выездная экскурсия из Тбилиси в Мцхету с монастырем Джвари и собором Светицховели.",
      longDescription: "Маршрут знакомит с древней столицей Грузии и важнейшими христианскими памятниками страны. Гид объясняет историческое значение Мцхеты, показывает панораму с Джвари и помогает понять связь религии, политики и культуры.",
      price: 120,
      currency: "USD",
      durationHours: 5,
      rating: 4.88,
      reviewCount: 65,
      language: "English",
      maxGroupSize: 6,
      image: "",
      meetingPoint: "Площадь Свободы, Тбилиси",
      latitude: 41.8412,
      longitude: 44.7209,
      route: [
        { title: "Тбилиси", lat: 41.6934, lon: 44.8015, note: "Выезд из города" },
        { title: "Монастырь Джвари", lat: 41.8384, lon: 44.7342, note: "Панорама слияния рек" },
        { title: "Светицховели", lat: 41.842, lon: 44.7209, note: "Собор в центре Мцхеты" }
      ],
      program: ["Выезд из Тбилиси", "Джвари и обзорная площадка", "Собор Светицховели", "Прогулка по Мцхете и возвращение"],
      gallery: ["", "", ""]
    },
    {
      slug: "dubai-burj-khalifa-future",
      guideSlug: "omar-al-mansouri",
      title: "Burj Khalifa, Dubai Mall и Museum of the Future",
      country: "ОАЭ",
      city: "Дубай",
      region: "Дубай",
      category: "Обзорная",
      description: "Современный Дубай за один маршрут: небоскребы, Dubai Mall, фонтаны и Museum of the Future.",
      longDescription: "Экскурсия показывает Дубай как город быстрых инженерных решений и туристической инфраструктуры. Гид объясняет, как формировался Downtown, почему Burj Khalifa стал символом эмирата и как Museum of the Future работает как архитектурный объект.",
      price: 145,
      currency: "USD",
      durationHours: 4,
      rating: 4.82,
      reviewCount: 156,
      language: "English",
      maxGroupSize: 8,
      image: "",
      meetingPoint: "Dubai Mall main entrance",
      latitude: 25.1972,
      longitude: 55.2744,
      route: [
        { title: "Dubai Mall", lat: 25.1972, lon: 55.2796, note: "Старт маршрута" },
        { title: "Burj Khalifa", lat: 25.1972, lon: 55.2744, note: "Главная высотная доминанта" },
        { title: "Museum of the Future", lat: 25.2191, lon: 55.2819, note: "Архитектура и город будущего" }
      ],
      program: ["Встреча в Dubai Mall", "Downtown Dubai и Burj Khalifa", "Дубайские фонтаны", "Переезд к Museum of the Future"],
      gallery: ["", "", ""]
    },
    {
      slug: "al-fahidi-dubai-creek",
      guideSlug: "omar-al-mansouri",
      title: "Исторический Al Fahidi и Dubai Creek",
      country: "ОАЭ",
      city: "Дубай",
      region: "Дубай",
      category: "Историческая",
      description: "Старый Дубай: район Al Fahidi, ветряные башни, рынки и переправа через Dubai Creek.",
      longDescription: "Маршрут раскрывает Дубай до эпохи небоскребов. Участники пройдут по Al Fahidi, увидят традиционные дома с ветряными башнями, пересекут Dubai Creek на абре и узнают о торговле, жемчуге и порте.",
      price: 95,
      currency: "USD",
      durationHours: 3.5,
      rating: 4.79,
      reviewCount: 103,
      language: "Русский",
      maxGroupSize: 10,
      image: "",
      meetingPoint: "Al Fahidi Historical Neighbourhood",
      latitude: 25.2644,
      longitude: 55.2996,
      route: [
        { title: "Al Fahidi", lat: 25.2644, lon: 55.2996, note: "Исторический квартал" },
        { title: "Dubai Creek", lat: 25.2632, lon: 55.3002, note: "Переправа на абре" },
        { title: "Gold Souk", lat: 25.2697, lon: 55.2962, note: "Торговые кварталы" }
      ],
      program: ["Al Fahidi и традиционная архитектура", "Музейный квартал и кофе-пауза", "Переправа через Dubai Creek", "Рынки Deira и финал маршрута"],
      gallery: ["", "", ""]
    },
    {
      slug: "palm-marina-evening-dubai",
      guideSlug: "omar-al-mansouri",
      title: "Palm Jumeirah, Dubai Marina и вечерний Дубай",
      country: "ОАЭ",
      city: "Дубай",
      region: "Дубай",
      category: "Обзорная",
      description: "Вечерний маршрут по Palm Jumeirah и Dubai Marina с панорамными точками.",
      longDescription: "Экскурсия подходит для тех, кто хочет увидеть современный курортный Дубай в комфортное вечернее время. В программе Palm Jumeirah, набережная Dubai Marina, виды на небоскребы и рассказ о развитии прибрежных районов.",
      price: 130,
      currency: "USD",
      durationHours: 4,
      rating: 4.77,
      reviewCount: 94,
      language: "English",
      maxGroupSize: 7,
      image: "",
      meetingPoint: "Dubai Marina Mall",
      latitude: 25.0801,
      longitude: 55.1403,
      route: [
        { title: "Dubai Marina", lat: 25.0801, lon: 55.1403, note: "Набережная и небоскребы" },
        { title: "Palm Jumeirah", lat: 25.1124, lon: 55.139, note: "Искусственный остров" },
        { title: "The Pointe", lat: 25.1304, lon: 55.1171, note: "Вечерняя панорама Atlantis" }
      ],
      program: ["Встреча в Dubai Marina", "Променад и архитектура района", "Palm Jumeirah и видовые точки", "Финал у The Pointe"],
      gallery: ["", "", ""]
    },
    {
      slug: "dubai-desert-safari-certified",
      guideSlug: "omar-al-mansouri",
      title: "Пустынное сафари с сертифицированным инструктором",
      country: "ОАЭ",
      city: "Дубай",
      region: "Дубай",
      category: "Природная",
      description: "Безопасный выезд в пустыню: дюны, закат, лагерь и сопровождение лицензированного инструктора.",
      longDescription: "Программа включает трансфер, движение по дюнам с сертифицированным водителем, остановки для фото на закате и вечерний лагерь. Особое внимание уделено безопасности, погодным условиям и правилам поведения в пустыне.",
      price: 180,
      currency: "USD",
      durationHours: 6,
      rating: 4.85,
      reviewCount: 121,
      language: "English",
      maxGroupSize: 6,
      image: "",
      meetingPoint: "Hotel pickup inside Dubai",
      latitude: 24.947,
      longitude: 55.592,
      route: [
        { title: "Dubai pickup", lat: 25.2048, lon: 55.2708, note: "Трансфер из города" },
        { title: "Desert conservation area", lat: 24.947, lon: 55.592, note: "Дюны и фото-паузы" },
        { title: "Desert camp", lat: 24.95, lon: 55.61, note: "Вечерняя программа" }
      ],
      program: ["Трансфер из отеля", "Инструктаж и выезд к дюнам", "Закат и фото-точки", "Ужин в лагере и возвращение"],
      gallery: ["", "", ""]
    }

,
    {
      slug: "zurich-old-town-limmat",
      guideSlug: "lukas-meier",
      title: "Старый Цюрих и набережная Лиммата",
      country: "Швейцария",
      city: "Цюрих",
      region: "Кантон Цюрих",
      category: "Обзорная / Историческая",
      description: "Прогулка по историческому центру Цюриха с ключевыми храмами и элегантной улицей Bahnhofstrasse.",
      longDescription: "Экскурсия охватывает старые кварталы Цюриха, где сохранились средневековые улицы и гильдейские дома, а затем выходит к набережной Лиммата и современной деловой оси города. Маршрут подойдет для первого знакомства с Цюрихом и его архитектурными контрастами.",
      price: 95,
      currency: "CHF",
      durationHours: 3,
      rating: 4.9,
      reviewCount: 58,
      language: "Deutsch, English",
      maxGroupSize: 10,
      image: GUIDE_PLACEHOLDER,
      meetingPoint: "Paradeplatz, Zurich",
      latitude: 47.3769,
      longitude: 8.5417,
      route: [
        { title: "Старый город (Altstadt)", lat: 47.3722, lon: 8.5426, note: "Узкие улицы и старые дома" },
        { title: "Гроссмюнстер", lat: 47.3701, lon: 8.5441, note: "Один из символов Цюриха" },
        { title: "Фраумюнстер", lat: 47.3698, lon: 8.5402, note: "Витражи и история монастыря" },
        { title: "Bahnhofstrasse", lat: 47.3733, lon: 8.5392, note: "Главная прогулочная улица" }
      ],
      program: ["Встреча на Paradeplatz и вводный блок", "Прогулка по Altstadt", "Гроссмюнстер и Фраумюнстер", "Набережная Лиммата и Bahnhofstrasse"],
      gallery: [],
      usePlaceholderAssets: true
    },
    {
      slug: "lucerne-kapelbrucke-alps",
      guideSlug: "lukas-meier",
      title: "Люцерн, мост Капельбрюкке и виды на Альпы",
      country: "Швейцария",
      city: "Люцерн",
      region: "Кантон Люцерн",
      category: "Обзорная / Природная",
      description: "Классический маршрут по Люцерну: деревянный мост Капельбрюкке, старый центр и озерные панорамы.",
      longDescription: "Во время экскурсии гости увидят визитные карточки Люцерна и узнают, как город развивался на стыке торговых путей и альпийских маршрутов. Программа сочетает городскую архитектуру, памятники и живописные виды на озеро Люцерн.",
      price: 110,
      currency: "CHF",
      durationHours: 4,
      rating: 4.88,
      reviewCount: 47,
      language: "Deutsch, English",
      maxGroupSize: 10,
      image: GUIDE_PLACEHOLDER,
      meetingPoint: "Kapellplatz, Luzern",
      latitude: 47.0502,
      longitude: 8.3093,
      route: [
        { title: "Капельбрюкке", lat: 47.0517, lon: 8.3078, note: "Средневековый деревянный мост" },
        { title: "Старый город Люцерна", lat: 47.0511, lon: 8.3057, note: "Площади и расписные фасады" },
        { title: "Львиный монумент", lat: 47.0579, lon: 8.3124, note: "Памятник швейцарской гвардии" },
        { title: "Набережная озера Люцерн", lat: 47.0495, lon: 8.3116, note: "Панорама Альп" }
      ],
      program: ["Встреча у Kapellplatz", "Капельбрюкке и Старый город", "Львиный монумент", "Прогулка у озера и обзор Альп"],
      gallery: [],
      usePlaceholderAssets: true
    },
    {
      slug: "interlaken-bernese-alps-panorama", "guideSlug": "anna-keller", "title": "Интерлакен и панорамы Бернских Альп", "country": "Швейцария", "city": "Интерлакен", "region": "Кантон Берн", "category": "Природная", "description": "Альпийский маршрут с обзорными площадками и видами на озёра Тун и Бриенц.", "longDescription": "Экскурсия знакомит с Интерлакеном как горной базой региона Юнгфрау и дает сбалансированный маршрут между городом и природными точками. Участники увидят панорамы Бернских Альп, озера и ключевые фотолокации.", "price": 150, "currency": "CHF", "durationHours": 6, "rating": 4.92, "reviewCount": 39, "language": "Deutsch, English", "maxGroupSize": 8, "image": GUIDE_PLACEHOLDER, "meetingPoint": "Interlaken Ost", "latitude": 46.6863, "longitude": 7.8632,
      route: [ { title: "Interlaken Ost", lat: 46.6857, lon: 7.8699, note: "Старт маршрута" }, { title: "Harder Kulm Viewpoint", lat: 46.6986, lon: 7.8552, note: "Панорама Альп" }, { title: "Озеро Тун (панорама)", lat: 46.6949, lon: 7.8022, note: "Виды на западное озеро" }, { title: "Озеро Бриенц (панорама)", lat: 46.7295, lon: 7.9603, note: "Виды на восточное озеро" }],
      program: ["Встреча в Interlaken Ost", "Подъем к обзорной площадке", "Панорамы озера Тун", "Переезд к точкам на озере Бриенц"], gallery: [], usePlaceholderAssets: true },
    {
      slug: "geneva-international-old-town", guideSlug: "anna-keller", title: "Женева: международный квартал и старый город", country: "Швейцария", city: "Женева", region: "Кантон Женева", category: "Обзорная / Авторская", description: "Маршрут по озеру, старым кварталам и району международных организаций Женевы.", longDescription: "Экскурсия показывает Женеву как город дипломатии и исторического наследия. В программе прогулка по набережной, старому центру и кварталам, связанным с международными институтами.", price: 120, currency: "CHF", durationHours: 3.5, rating: 4.87, reviewCount: 42, language: "Français, English", maxGroupSize: 10, image: GUIDE_PLACEHOLDER, meetingPoint: "Jardin Anglais", latitude: 46.2044, longitude: 6.1432,
      route: [ { title: "Женевское озеро", lat: 46.2071, lon: 6.1538, note: "Набережная и вид на Jet d’Eau" }, { title: "Jet d’Eau", lat: 46.2073, lon: 6.1554, note: "Символ Женевы" }, { title: "Старый город", lat: 46.2018, lon: 6.1481, note: "Исторические улицы" }, { title: "Собор Святого Петра", lat: 46.2011, lon: 6.1484, note: "Главный храм старой Женевы" }, { title: "Квартал ООН", lat: 46.2266, lon: 6.1402, note: "Дипломатический район" }],
      program: ["Встреча у Женевского озера", "Jet d’Eau и история города", "Старый город и собор Святого Петра", "Международный квартал"], gallery: [], usePlaceholderAssets: true },
    {
      slug: "berlin-xx-century-traces", guideSlug: "hans-muller", title: "Берлин: Бранденбургские ворота и следы XX века", country: "Германия", city: "Берлин", region: "Берлин", category: "Историческая", description: "Интенсивная прогулка по ключевым местам памяти Берлина XX века.", longDescription: "Маршрут объединяет символы Берлина и важные точки, связанные с событиями XX века. Экскурсия помогает собрать целостную картину городской истории без перегруза деталями.", price: 85, currency: "EUR", durationHours: 3, rating: 4.93, reviewCount: 76, language: "Deutsch, English", maxGroupSize: 12, image: GUIDE_PLACEHOLDER, meetingPoint: "Brandenburg Gate", latitude: 52.52, longitude: 13.405,
      route: [ { title: "Бранденбургские ворота", lat: 52.5163, lon: 13.3777, note: "Старт" }, { title: "Рейхстаг", lat: 52.5186, lon: 13.3762, note: "Парламент Германии" }, { title: "Мемориал Холокоста", lat: 52.5139, lon: 13.3787, note: "Мемориальный комплекс" }, { title: "Berlin Wall Memorial", lat: 52.5351, lon: 13.3903, note: "Следы стены" }, { title: "Checkpoint Charlie", lat: 52.5076, lon: 13.3904, note: "Пограничный пункт" }],
      program: ["Бранденбургские ворота и введение", "Рейхстаг и правительственный квартал", "Мемориалы XX века", "Финал у Checkpoint Charlie"], gallery: [], usePlaceholderAssets: true },
    {
      slug: "munich-marienplatz-bavarian-traditions", guideSlug: "sophie-schneider", title: "Мюнхен: старый город, Мариенплац и баварские традиции", country: "Германия", city: "Мюнхен", region: "Бавария", category: "Обзорная / Гастрономическая", description: "Прогулка по историческому центру Мюнхена с акцентом на городские традиции и рынки.", longDescription: "Экскурсия сочетает обзор центральных площадей и гастрономическую составляющую, знакомя гостей с локальной культурой Баварии. Подойдет для первого дня в Мюнхене.", price: 95, currency: "EUR", durationHours: 3.5, rating: 4.86, reviewCount: 61, language: "Deutsch, English", maxGroupSize: 10, image: GUIDE_PLACEHOLDER, meetingPoint: "Marienplatz", latitude: 48.1351, longitude: 11.582,
      route: [ { title: "Мариенплац", lat: 48.1374, lon: 11.5755, note: "Сердце старого города" }, { title: "Новая ратуша", lat: 48.1371, lon: 11.5754, note: "Готический фасад" }, { title: "Виктуалиенмаркт", lat: 48.1351, lon: 11.576, note: "Гастрономический рынок" }, { title: "Хофбройхаус", lat: 48.1375, lon: 11.5796, note: "Баварские традиции" }],
      program: ["Встреча на Мариенплац", "Старый центр и ратуша", "Виктуалиенмаркт", "Финал в районе Хофбройхаус"], gallery: [], usePlaceholderAssets: true },
    {
      slug: "neuschwanstein-romantic-bavaria", guideSlug: "sophie-schneider", title: "Замок Нойшванштайн и романтическая Бавария", country: "Германия", city: "Нойшванштайн", region: "Бавария", category: "Выездная / Историческая", description: "Выездная программа к Нойшванштайну с альпийскими видами и деревней Хоэншвангау.", longDescription: "Маршрут рассчитан на целый день и включает комфортный трансфер, обзор окрестностей замка и исторический контекст Баварии XIX века. Экскурсия для любителей замковой архитектуры и горных пейзажей.", price: 165, currency: "EUR", durationHours: 8, rating: 4.91, reviewCount: 54, language: "Deutsch, English", maxGroupSize: 8, image: GUIDE_PLACEHOLDER, meetingPoint: "Hohenschwangau Ticket Center", latitude: 47.5576, longitude: 10.7498,
      route: [ { title: "Hohenschwangau", lat: 47.5566, lon: 10.7397, note: "Старт у подножия" }, { title: "Замок Нойшванштайн", lat: 47.5576, lon: 10.7498, note: "Главная точка" }, { title: "Marienbrücke", lat: 47.5574, lon: 10.749, note: "Панорама замка" }],
      program: ["Сбор и трансфер", "Подход к замку и исторический блок", "Панорамы Альп и Хоэншвангау", "Возвращение"], gallery: [], usePlaceholderAssets: true },
    {
      slug: "dresden-baroque-old-masters", guideSlug: "hans-muller", title: "Дрезден: барочный центр и Галерея старых мастеров", country: "Германия", city: "Дрезден", region: "Саксония", category: "Музейная / Историческая", description: "Исторический центр Дрездена и ключевые объекты художественного наследия города.", longDescription: "Экскурсия соединяет прогулку по барочному центру и посещение важнейших музейных точек Дрездена. Подходит для путешественников, которым интересны архитектура и живопись старых мастеров.", price: 90, currency: "EUR", durationHours: 4, rating: 4.84, reviewCount: 45, language: "Deutsch, English", maxGroupSize: 10, image: GUIDE_PLACEHOLDER, meetingPoint: "Theaterplatz, Dresden", latitude: 51.0504, longitude: 13.7373,
      route: [ { title: "Цвингер", lat: 51.0524, lon: 13.7364, note: "Барочный ансамбль" }, { title: "Фрауэнкирхе", lat: 51.051, lon: 13.7416, note: "Символ восстановления Дрездена" }, { title: "Набережная Эльбы", lat: 51.0542, lon: 13.7419, note: "Вид на старый город" }, { title: "Галерея старых мастеров", lat: 51.0528, lon: 13.7352, note: "Музейный блок" }],
      program: ["Встреча на Theaterplatz", "Цвингер и барочный квартал", "Фрауэнкирхе и набережная", "Галерея старых мастеров"], gallery: [], usePlaceholderAssets: true },
    {
      slug: "tokyo-asakusa-shibuya-metropolis", guideSlug: "haruto-tanaka", title: "Токио: Асакуса, Сибуя и современный мегаполис", country: "Япония", city: "Токио", region: "Токио", category: "Обзорная", description: "Маршрут между исторической Асакусой и динамичным Сибуя с обзорной современной точкой.", longDescription: "Экскурсия помогает увидеть контраст Токио: от храмового района Асакуса до неоновых улиц Сибуя. Гид объясняет, как традиционные пространства сосуществуют с современной городской средой.", price: 14000, currency: "JPY", durationHours: 4, rating: 4.94, reviewCount: 69, language: "Japanese, English", maxGroupSize: 10, image: GUIDE_PLACEHOLDER, meetingPoint: "Kaminarimon Gate, Asakusa", latitude: 35.6762, longitude: 139.6503,
      route: [ { title: "Сэнсо-дзи", lat: 35.7148, lon: 139.7967, note: "Исторический храм" }, { title: "Район Асакуса", lat: 35.7119, lon: 139.7965, note: "Традиционные улицы" }, { title: "Перекресток Сибуя", lat: 35.6595, lon: 139.7005, note: "Символ современного Токио" }, { title: "Tokyo Metropolitan Government Building", lat: 35.6896, lon: 139.6917, note: "Обзорная точка" }],
      program: ["Встреча в Асакусе", "Сэнсо-дзи и квартал ремесел", "Переезд в Сибуя", "Современный Токио и обзорная площадка"], gallery: [], usePlaceholderAssets: true },
    {
      slug: "kyoto-temples-gion-gardens", guideSlug: "aiko-nakamura", title: "Киото: храмы, сады и квартал Гион", country: "Япония", city: "Киото", region: "Кансай", category: "Историческая / Культурная", description: "Классический маршрут по храмам Киото и историческому кварталу Гион.", longDescription: "Программа охватывает самые узнаваемые культурные точки Киото и дает контекст о религиозных традициях, городском укладе и чайной культуре. Подходит для первого посещения древней столицы Японии.", price: 16000, currency: "JPY", durationHours: 5, rating: 4.97, reviewCount: 73, language: "Japanese, English", maxGroupSize: 8, image: GUIDE_PLACEHOLDER, meetingPoint: "Fushimi Inari Taisha", latitude: 35.0116, longitude: 135.7681,
      route: [ { title: "Фусими Инари", lat: 34.9671, lon: 135.7727, note: "Тории и храмовый комплекс" }, { title: "Кинкаку-дзи", lat: 35.0394, lon: 135.7292, note: "Золотой павильон" }, { title: "Квартал Гион", lat: 35.0037, lon: 135.7788, note: "Традиционные улицы" }, { title: "Hanamikoji Street", lat: 35.0031, lon: 135.7778, note: "Чайные дома" }],
      program: ["Встреча у Фусими Инари", "Переезд к Кинкаку-дзи", "Прогулка по Гиону", "Традиционные улицы и чайные дома"], gallery: [], usePlaceholderAssets: true },
    {
      slug: "nara-deer-park-ancient-temples", guideSlug: "aiko-nakamura", title: "Нара: парк оленей и древние храмы", country: "Япония", city: "Нара", region: "Кансай", category: "Семейная / Историческая", description: "Прогулка по Наре с оленями, храмами и историческими кварталами древней столицы.", longDescription: "Экскурсия сочетает семейный формат и исторический контекст: от знаменитого парка Нары до крупнейших храмовых комплексов региона. Маршрут подходит для первого знакомства с Нарой и спокойного путешествия в комфортном темпе.", price: 13500, currency: "JPY", durationHours: 4, rating: 4.92, reviewCount: 44, language: "Japanese, English", maxGroupSize: 10, image: GUIDE_PLACEHOLDER, meetingPoint: "Nara Park Visitor Center", latitude: 34.6851, longitude: 135.8048,
      route: [{ title: "Парк Нара", lat: 34.6851, lon: 135.8398, note: "Олени и прогулочные аллеи" }, { title: "Тодай-дзи", lat: 34.689, lon: 135.8398, note: "Большой зал Будды" }, { title: "Касуга-тайся", lat: 34.6817, lon: 135.8489, note: "Святилище и каменные фонари" }, { title: "Нарамати", lat: 34.6778, lon: 135.8276, note: "Старые кварталы Нары" }],
      program: ["Встреча у парка Нара", "Тодай-дзи и исторический блок", "Святилище Касуга-тайся", "Прогулка по старым кварталам Нары"], gallery: [], usePlaceholderAssets: true
    },
    {
      slug: "fuji-hakone-lake-volcano-views", guideSlug: "ren-sato", title: "Фудзи и Хаконе: природа, озеро и виды на вулкан", country: "Япония", city: "Хаконе", region: "Хаконе / Фудзи", category: "Природная / Выездная", description: "Большой выездной маршрут к озеру Аси, канатной дороге Хаконе и панорамам Фудзи.", longDescription: "Программа рассчитана на целый день и включает природные локации Хаконе с лучшими точками обзора на Фудзи. Экскурсия сочетает мягкий трекинг, панорамные переезды и знакомство с термальной географией региона.", price: 22000, currency: "JPY", durationHours: 8, rating: 4.95, reviewCount: 52, language: "Japanese, English", maxGroupSize: 8, image: GUIDE_PLACEHOLDER, meetingPoint: "Hakone-Yumoto Station", latitude: 35.2324, longitude: 139.1069,
      route: [{ title: "Озеро Аси", lat: 35.2049, lon: 139.0252, note: "Круизные и панорамные точки" }, { title: "Канатная дорога Хаконе", lat: 35.2456, lon: 139.0185, note: "Панорама Овакудани" }, { title: "Овакудани", lat: 35.2456, lon: 139.0213, note: "Вулканическая долина" }, { title: "Смотровая на Фудзи", lat: 35.3606, lon: 138.7274, note: "Видовые точки на вулкан" }],
      program: ["Выезд из Хаконе-Юмото", "Озеро Аси и обзор региона", "Канатная дорога и Овакудани", "Панорамы Фудзи и возвращение"], gallery: [], usePlaceholderAssets: true
    },
    {
      slug: "osaka-food-night-dotonbori", guideSlug: "ren-sato", title: "Осака: гастрономический маршрут и вечерний Дотонбори", country: "Япония", city: "Осака", region: "Кансай", category: "Гастрономическая / Обзорная", description: "Вечерняя прогулка по рынкам и неоновым улицам Осаки с акцентом на локальную кухню.", longDescription: "Экскурсия показывает Осаку как гастрономическую столицу Японии: от исторических рынков до динамичного Дотонбори. Формат подходит для вечернего знакомства с городом и его уличной культурой.", price: 12000, currency: "JPY", durationHours: 3.5, rating: 4.9, reviewCount: 67, language: "Japanese, English", maxGroupSize: 10, image: GUIDE_PLACEHOLDER, meetingPoint: "Namba Station", latitude: 34.6937, longitude: 135.5023,
      route: [{ title: "Куромон Итиба", lat: 34.6652, lon: 135.5063, note: "Рынок и локальные продукты" }, { title: "Синсэкай", lat: 34.6525, lon: 135.5063, note: "Ретро-квартал Осаки" }, { title: "Дотонбори", lat: 34.6687, lon: 135.5022, note: "Неоновые вывески и каналы" }],
      program: ["Встреча у Намбы", "Рынок Куромон и гастрономический блок", "Синсэкай и история района", "Вечерний Дотонбори"], gallery: [], usePlaceholderAssets: true
    },
    {
      slug: "hiroshima-miyajima-itsukushima", guideSlug: "ren-sato", title: "Хиросима и остров Миядзима: история и святилище Ицукусима", country: "Япония", city: "Хиросима", region: "Хиросима / Миядзима", category: "Историческая / Выездная", description: "Маршрут о памяти и культуре: Мемориальный парк мира и остров Миядзима.", longDescription: "Экскурсия объединяет две ключевые темы региона: историю Хиросимы XX века и духовное наследие Миядзимы. В программе мемориальный комплекс, музей и паром к святилищу Ицукусима с легендарными ториями в воде.", price: 24000, currency: "JPY", durationHours: 7, rating: 4.96, reviewCount: 49, language: "Japanese, English", maxGroupSize: 8, image: GUIDE_PLACEHOLDER, meetingPoint: "Hiroshima Peace Memorial Park", latitude: 34.3853, longitude: 132.4553,
      route: [{ title: "Парк мира", lat: 34.3928, lon: 132.4522, note: "Мемориальный маршрут" }, { title: "Музей мира", lat: 34.3915, lon: 132.4519, note: "Исторический блок" }, { title: "Остров Миядзима", lat: 34.2959, lon: 132.3198, note: "Паром и островная часть" }, { title: "Ицукусима", lat: 34.2959, lon: 132.3199, note: "Святилище и тории" }],
      program: ["Мемориальный парк и музей", "Переезд к порту", "Паром на Миядзиму", "Святилище Ицукусима и финальный блок"], gallery: [], usePlaceholderAssets: true
    },
    {
      slug: "kamakura-great-buddha-ocean", guideSlug: "aiko-nakamura", title: "Камакура: Великий Будда, храмы и океан", country: "Япония", city: "Камакура", region: "Канто", category: "Историческая / Природная", description: "Однодневная поездка в Камакуру: Великий Будда, храмы и прогулка у океана.", longDescription: "Экскурсия знакомит с бывшей столицей сёгуната через религиозные памятники и прибрежные пейзажи. Маршрут построен так, чтобы совместить культурные объекты и отдых у моря.", price: 17000, currency: "JPY", durationHours: 5, rating: 4.91, reviewCount: 41, language: "Japanese, English", maxGroupSize: 9, image: GUIDE_PLACEHOLDER, meetingPoint: "Kamakura Station", latitude: 35.3192, longitude: 139.5467,
      route: [{ title: "Котоку-ин (Великий Будда)", lat: 35.3167, lon: 139.5359, note: "Главная святыня Камакуры" }, { title: "Хасэ-дэра", lat: 35.3139, lon: 139.5326, note: "Храм на склоне" }, { title: "Цуругаока Хатимангу", lat: 35.3258, lon: 139.5568, note: "Ключевое святилище" }, { title: "Юигахама", lat: 35.3064, lon: 139.5346, note: "Побережье Тихого океана" }],
      program: ["Встреча у станции Камакура", "Котоку-ин и Хасэ-дэра", "Цуругаока Хатимангу", "Побережье Юигахама"], gallery: [], usePlaceholderAssets: true
    },
    {
      slug: "nikko-toshogu-mountains", guideSlug: "haruto-tanaka", title: "Никко: святилище Тосёгу и горные пейзажи", country: "Япония", city: "Никко", region: "Тотиги", category: "Выездная / Историческая / Природная", description: "Выезд в горный Никко: храмовый ансамбль, озеро и водопады национального парка.", longDescription: "Маршрут охватывает культурное наследие эпохи Токугава и природные ландшафты Никко. Экскурсия подойдет для гостей, кто хочет увидеть сочетание храмовой архитектуры и горных панорам.", price: 23000, currency: "JPY", durationHours: 8, rating: 4.94, reviewCount: 38, language: "Japanese, English", maxGroupSize: 8, image: GUIDE_PLACEHOLDER, meetingPoint: "Nikko Station", latitude: 36.7581, longitude: 139.5989,
      route: [{ title: "Тосёгу", lat: 36.7579, lon: 139.5998, note: "Святилище Токугава Иэясу" }, { title: "Мост Синкё", lat: 36.7554, lon: 139.6047, note: "Исторический красный мост" }, { title: "Водопад Кэгон", lat: 36.738, lon: 139.5008, note: "Один из главных водопадов Японии" }, { title: "Озеро Тюдзэндзи", lat: 36.7387, lon: 139.4872, note: "Горное озеро Никко" }],
      program: ["Выезд и знакомство с Никко", "Тосёгу и Синкё", "Переезд к Кэгону", "Озеро Тюдзэндзи и возвращение"], gallery: [], usePlaceholderAssets: true
    },
    {
      slug: "beijing-forbidden-city-tiananmen", guideSlug: "li-wei", title: "Пекин: Запретный город и площадь Тяньаньмэнь", country: "Китай", city: "Пекин", region: "Пекин", category: "Историческая", description: "Ключевые императорские и государственные символы Пекина в одном маршруте.", longDescription: "Экскурсия знакомит с планировкой императорской столицы, главной площадью страны и архитектурой Запретного города. Гид помогает пройти маршрут в логичном порядке и понять исторический контекст эпох Мин и Цин.", price: 780, currency: "CNY", durationHours: 4, rating: 4.9, reviewCount: 72, language: "Chinese, English", maxGroupSize: 12, image: GUIDE_PLACEHOLDER, meetingPoint: "Tiananmen East Metro Exit", latitude: 39.9042, longitude: 116.4074,
      route: [{ title: "Площадь Тяньаньмэнь", lat: 39.9055, lon: 116.3976, note: "Исторический центр Пекина" }, { title: "Ворота Умэнь", lat: 39.9163, lon: 116.3972, note: "Главный вход в Запретный город" }, { title: "Императорские дворы", lat: 39.9152, lon: 116.4039, note: "Центральная ось дворцового комплекса" }],
      program: ["Встреча на Тяньаньмэнь", "История площади", "Запретный город и императорские дворы", "Финальный блок и рекомендации"], gallery: [], usePlaceholderAssets: true
    },
    {
      slug: "mutianyu-great-wall-day-trip", guideSlug: "li-wei", title: "Великая Китайская стена: участок Мутяньюй", country: "Китай", city: "Мутяньюй", region: "Пекин / Мутяньюй", category: "Выездная / Историческая", description: "Выезд к одному из самых живописных и удобных участков Великой Китайской стены.", longDescription: "Маршрут включает трансфер из Пекина, прогулку по стене между башнями и рассказ о военной инженерии имперского Китая. Экскурсия рассчитана на комфортный темп и обзорные фото-точки.", price: 1280, currency: "CNY", durationHours: 7, rating: 4.93, reviewCount: 64, language: "Chinese, English", maxGroupSize: 10, image: GUIDE_PLACEHOLDER, meetingPoint: "Dongzhimen Transport Hub", latitude: 40.4319, longitude: 116.5704,
      route: [{ title: "Выезд из Пекина", lat: 39.941, lon: 116.4343, note: "Старт трансфера" }, { title: "Мутяньюй", lat: 40.4319, lon: 116.5704, note: "Главный вход на участок" }, { title: "Смотровые башни", lat: 40.4328, lon: 116.5648, note: "Панорамы горного хребта" }],
      program: ["Сбор и выезд из Пекина", "Подъем на участок Мутяньюй", "Прогулка по стене", "Возвращение в Пекин"], gallery: [], usePlaceholderAssets: true
    },
    {
      slug: "shanghai-bund-pudong-old-city", guideSlug: "chen-mei", title: "Шанхай: Бунд, небоскрёбы и старый город", country: "Китай", city: "Шанхай", region: "Шанхай", category: "Обзорная / Архитектурная", description: "Контрастный маршрут между колониальным Бундом, футуристичным Пудуном и старым Шанхаем.", longDescription: "Экскурсия показывает разные эпохи Шанхая: исторические фасады на Бунде, высотный силуэт Пудуна и традиционные кварталы у сада Юйюань. Подходит для первого полноценного знакомства с городом.", price: 860, currency: "CNY", durationHours: 4, rating: 4.88, reviewCount: 58, language: "Chinese, English", maxGroupSize: 12, image: GUIDE_PLACEHOLDER, meetingPoint: "The Bund, Chenyi Square", latitude: 31.2304, longitude: 121.4737,
      route: [{ title: "Бунд", lat: 31.2401, lon: 121.4905, note: "Историческая набережная" }, { title: "Пудун", lat: 31.2354, lon: 121.4998, note: "Небоскребы делового района" }, { title: "Shanghai Tower", lat: 31.2336, lon: 121.5055, note: "Одна из доминант города" }, { title: "Сад Юйюань", lat: 31.2273, lon: 121.4921, note: "Традиционный китайский сад" }],
      program: ["Встреча на Бунде", "Переход к Пудуну", "Блок современной архитектуры", "Старый город и Юйюань"], gallery: [], usePlaceholderAssets: true
    },
    {
      slug: "xian-terracotta-ancient-capital", guideSlug: "chen-mei", title: "Сиань: Терракотовая армия и древняя столица", country: "Китай", city: "Сиань", region: "Шэньси", category: "Историческая / Музейная", description: "Историческая программа по Сианю с Терракотовой армией и стенами древней столицы.", longDescription: "Маршрут включает один из главных археологических памятников Китая и ключевые точки старого Сианя. Экскурсия выстроена так, чтобы увидеть и музейный комплекс, и городское наследие древней столицы.", price: 1180, currency: "CNY", durationHours: 6, rating: 4.94, reviewCount: 53, language: "Chinese, English", maxGroupSize: 10, image: GUIDE_PLACEHOLDER, meetingPoint: "Xi'an Bell Tower Metro Exit", latitude: 34.3416, longitude: 108.9398,
      route: [{ title: "Терракотовая армия", lat: 34.3853, lon: 109.2732, note: "Археологический музей" }, { title: "Городская стена Сианя", lat: 34.2658, lon: 108.9552, note: "Древний оборонительный периметр" }, { title: "Мусульманский квартал", lat: 34.2655, lon: 108.9471, note: "Исторический торговый район" }],
      program: ["Выезд к Терракотовой армии", "Музейный блок и история находки", "Возвращение в центр Сианя", "Городская стена и мусульманский квартал"], gallery: [], usePlaceholderAssets: true
    },
  ];

  for (const tour of tours) {
    const { guideSlug, route, program, usePlaceholderAssets, ...tourData } = tour;
    const explicitGallery = ((tour as { gallery?: string[] }).gallery ?? []).filter(Boolean);
    delete (tourData as Record<string, unknown>).gallery;
    await prisma.tour.create({
      data: {
        ...tourData,
        image: tourData.image && tourData.image !== GUIDE_PLACEHOLDER
          ? tourData.image
          : usePlaceholderAssets
            ? (tourData.image || GUIDE_PLACEHOLDER)
            : (TOUR_ASSETS_BY_SLUG[tour.slug]?.image ?? tourAsset(tour.slug, "cover")),
        routeJson: JSON.stringify(route),
        programJson: JSON.stringify(program),
        galleryJson: JSON.stringify(explicitGallery.length >= 2
          ? explicitGallery
          : usePlaceholderAssets
            ? []
            : (TOUR_ASSETS_BY_SLUG[tour.slug]?.gallery ?? [tourAsset(tour.slug, "route-1"), tourAsset(tour.slug, "route-2")])),
        guideId: guideMap[guideSlug].id
      }
    });
  }

  const tourMap = Object.fromEntries((await prisma.tour.findMany()).map((tour) => [tour.slug, tour]));

  const themedReviewSnippets: Record<string, string[]> = {
    "peterhof-fountains": [
      "Фонтаны Петергофа и Нижний парк увидели в удобном темпе, рассказ про дворец был очень живой.",
      "Отлично продуман маршрут по парку: фонтаны, аллеи и история резиденции сложились в цельную картину."
    ],
    "bunker-42-underground-moscow": [
      "Подземные коридоры и атмосфера холодной войны действительно впечатляют.",
      "Маршрут по Бункеру-42 получился насыщенным: техника, история объекта и сильная подача материала."
    ],
    "old-tbilisi-narikala-baths": [
      "Старый Тбилиси раскрылся через дворики, крепость Нарикала и серные бани.",
      "Очень атмосферная прогулка по историческим кварталам и панорамным точкам города."
    ],
    "dubai-burj-khalifa-future": [
      "Понравился контраст между инженерными решениями Downtown и видами у Burj Khalifa.",
      "Экскурсия помогла понять, как формировался современный район вокруг башни."
    ]
  };

  const baseReviewAuthors = [
    "Ольга Петрова",
    "Илья Соколов",
    "Марина Громова",
    "Антон Беляев",
    "Елена Ершова",
    "Даниил Морозов",
    "Светлана Ким"
  ];

  const baseRatings = [5, 5, 5, 4, 5, 5, 4];

  let reviewIndex = 0;
  for (const tour of await prisma.tour.findMany({ include: { guide: true } })) {
    const snippets = themedReviewSnippets[tour.slug] ?? [
      `Маршрут «${tour.title}» получился очень содержательным: понятная логистика и хороший темп.`,
      `Особенно понравилось, как гид раскрыл тему экскурсии и ответил на вопросы по маршруту.`
    ];

    for (let i = 0; i < 6; i += 1) {
      const author = baseReviewAuthors[i % baseReviewAuthors.length];
      const text = snippets[i % snippets.length];
      const rating = baseRatings[i % baseRatings.length];
      await prisma.review.create({
        data: {
          userName: author,
          rating,
          text,
          createdAt: new Date(Date.UTC(2025, (reviewIndex + i) % 12, 2 + ((reviewIndex + i) % 26), 10, 0, 0)),
          tourId: tour.id,
          guideId: tour.guideId
        }
      });
    }

    const aggregates = await prisma.review.aggregate({
      where: { tourId: tour.id },
      _count: { _all: true },
      _avg: { rating: true }
    });

    await prisma.tour.update({
      where: { id: tour.id },
      data: {
        reviewCount: aggregates._count._all,
        rating: Number((aggregates._avg.rating ?? tour.rating).toFixed(2))
      }
    });

    reviewIndex += 6;
  }

  await prisma.booking.create({
    data: {
      userId: demoUserId,
      tourId: tourMap["kazan-kremlin-kul-sharif"].id,
      customerName: "Виталий Новиков",
      email: "demo@routecert.local",
      phone: "+7 900 123-45-67",
      date: new Date("2026-06-14T09:00:00.000Z"),
      people: 2,
      comment: "Нужен спокойный темп, едем с родителями.",
      totalPrice: 7350,
      status: "confirmed"
    }
  });

  await prisma.booking.create({
    data: {
      userId: demoUserId,
      tourId: tourMap["tretyakov-gallery-art"].id,
      customerName: "Виталий Новиков",
      email: "demo@routecert.local",
      phone: "+7 900 123-45-67",
      date: new Date("2025-11-18T11:00:00.000Z"),
      people: 1,
      comment: "Интересует живопись XIX века.",
      totalPrice: 3990,
      status: "completed"
    }
  });

  console.log("Seed completed: demo user, cities, guides, tours, reviews and bookings created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
