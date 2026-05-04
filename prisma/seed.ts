import path from "node:path";
import { PrismaClient } from "@prisma/client";

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
      { country: "ОАЭ", name: "Дубай", region: "Эмират Дубай", latitude: 25.2048, longitude: 55.2708 }
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
  ];

  for (const tour of tours) {
    const { guideSlug, route, program, ...tourData } = tour;
    delete (tourData as Record<string, unknown>).gallery;
    await prisma.tour.create({
      data: {
        ...tourData,
        image: tourAsset(tour.slug, "cover"),
        routeJson: JSON.stringify(route),
        programJson: JSON.stringify(program),
        galleryJson: JSON.stringify([tourAsset(tour.slug, "route-1"), tourAsset(tour.slug, "route-2")]),
        guideId: guideMap[guideSlug].id
      }
    });
  }

  const tourMap = Object.fromEntries((await prisma.tour.findMany()).map((tour) => [tour.slug, tour]));

  const reviews = [
    ["kazan-kremlin-kul-sharif", "aigul-safina", "Ольга Петрова", 5, "Айгуль провела маршрут спокойно и очень содержательно. Особенно понравился блок про сочетание культур в кремле."],
    ["kazan-kremlin-kul-sharif", "aigul-safina", "Илья Соколов", 5, "Хорошая структура экскурсии, не было ощущения перегруза датами."],
    ["sviyazhsk-raifa-day-trip", "timur-galeev", "Марина Громова", 5, "Свияжск оказался гораздо интереснее, чем ожидали. Трансфер и тайминг без сбоев."],
    ["blue-lakes-temple-all-religions", "timur-galeev", "Антон Беляев", 4, "Красивые места, гид заранее предупредил про обувь и погоду."],
    ["moscow-red-square-kremlin", "maria-volkova", "Елена Ершова", 5, "Мария умеет показывать знакомые места так, будто видишь их впервые."],
    ["moscow-red-square-kremlin", "maria-volkova", "Даниил Морозов", 5, "Отличный вариант для гостей Москвы. Много деталей про башни и площадь."],
    ["tretyakov-gallery-art", "maria-volkova", "Светлана Ким", 5, "Лучший музейный маршрут за последнее время. Все картины связались в понятную историю."],
    ["vdnh-ostankino-soviet-modern", "alexey-orlov", "Роман Андреев", 4, "ВДНХ с таким объяснением воспринимается совсем иначе. Хотелось бы еще полчаса на павильоны."],
    ["bunker-42-underground-moscow", "alexey-orlov", "Кирилл Захаров", 5, "Сильная тема и хороший баланс между фактами и городскими историями."],
    ["hermitage-masterpieces", "ekaterina-lebedeva", "Наталья Волкова", 5, "Екатерина построила маршрут очень логично. Даже подросткам было интересно."],
    ["hermitage-masterpieces", "ekaterina-lebedeva", "Павел Руднев", 5, "Понравилось, что экскурсия не была гонкой по залам."],
    ["peter-paul-fortress-history", "dmitry-kovalev", "Алиса Титова", 5, "Дмитрий отлично объясняет план крепости и историю города."],
    ["night-bridges-canals", "dmitry-kovalev", "Виктория Лазарева", 4, "Маршрут атмосферный, мосты посмотрели с хорошей точки."],
    ["peterhof-fountains", "ekaterina-lebedeva", "Сергей Лапин", 5, "Петергоф удобнее смотреть с гидом: стало понятно, как устроены фонтаны."],
    ["olkhon-baikal-legends", "artem-buryatov", "Ирина Кузнецова", 5, "Очень бережный подход к Байкалу и местным традициям. Ольхон впечатлил."],
    ["listvyanka-circum-baikal-railway", "artem-buryatov", "Максим Чернов", 5, "КБЖД стала главным открытием поездки. Логистика четкая."],
    ["buryatia-ethno-route", "artem-buryatov", "Анна Серова", 5, "Было спокойно, уважительно и очень познавательно. Хорошо объяснили правила посещения дацана."],
    ["old-tbilisi-narikala-baths", "nino-chavchavadze", "Екатерина Яковлева", 5, "Нино показывает город через людей и истории домов. Очень теплый маршрут."],
    ["old-tbilisi-narikala-baths", "nino-chavchavadze", "Михаил Абрамов", 5, "После экскурсии стало проще ориентироваться в Старом Тбилиси."],
    ["sololaki-rustaveli-architecture", "nino-chavchavadze", "Лаура Меликян", 5, "Сололаки с Нино — это настоящий городской архив."],
    ["mtskheta-day-trip", "nino-chavchavadze", "Peter Lewis", 5, "Clear English tour, great timing and beautiful views from Jvari."],
    ["dubai-burj-khalifa-future", "omar-al-mansouri", "Alex Parker", 5, "Omar connected the skyline with real urban planning context. Very professional."],
    ["al-fahidi-dubai-creek", "omar-al-mansouri", "Егор Никитин", 5, "Старый Дубай оказался самым интересным днем поездки."],
    ["palm-marina-evening-dubai", "omar-al-mansouri", "Sofia Mendes", 4, "Beautiful evening route and comfortable pace."],
    ["dubai-desert-safari-certified", "omar-al-mansouri", "Никита Воронин", 5, "Понравилось, что безопасность объяснили до выезда на дюны."],
    ["dubai-desert-safari-certified", "omar-al-mansouri", "Julia Weber", 5, "The safari felt organized and safe, sunset stop was excellent."]
  ] as const;

  for (let index = 0; index < reviews.length; index += 1) {
    const [tourSlug, guideSlug, userName, rating, text] = reviews[index];
    await prisma.review.create({
      data: {
        userName,
        rating,
        text,
        createdAt: new Date(Date.UTC(2025, index % 12, 4 + index, 10, 0, 0)),
        tourId: tourMap[tourSlug].id,
        guideId: guideMap[guideSlug].id
      }
    });
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
