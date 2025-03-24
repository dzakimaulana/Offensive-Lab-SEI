/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("books").del();

  // Inserts new book entries
  await knex("books").insert([
    {
      id: 1,
      title: "Konspirasi Alam Semesta",
      author: "Fiersa Besari",
      year: 2021,
      cover_image: "/images/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
    },
    {
      id: 2,
      title: "Pulang - Pergi",
      author: "Tere Liye",
      year: 2020,
      cover_image: "/images/98765432-1abc-4def-89ab-0123456789cd.jpg",
    },
    {
      id: 3,
      title: "33 Strategi Kekuasaan",
      author: "Robert Greene",
      year: 2022,
      cover_image: "/images/3f7f44c2-8a4b-4b9a-80db-4d8f7e289b3c.jpg",
    },
    {
      id: 4,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      year: 1960,
      cover_image: "/images/c4d75514-fb7b-4f1e-acdf-2f4f8024825a.jpg",
    },
    {
      id: 5,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      year: 1925,
      cover_image: "/images/3f7f44c2-8a4b-4b9a-80db-4d8f7e289b3c.jpg",
    },
    {
      id: 6,
      title: "Dilan: Dia adalah Dilanku Tahun 1990",
      author: "Pidi Baiq",
      year: 2014,
      cover_image: "/images/b7200382-fb67-4219-bb22-5861e55838d4.jpg",
    },
    {
      id: 7,
      title: "Habis Gelap Tebitlah Terang",
      author: "RA Kartini",
      year: 1938,
      cover_image: "/images/8c91b242-80d9-4c68-91fe-62752ab95fa8.jpg",
    },
    {
      id: 8,
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      year: 2005,
      cover_image: "/images/fd6755c6-7120-4d1b-97d4-6779a2b717c8.jpg",
    },
    {
      id: "9",
      title: "Pulang",
      author: "Tere Liye",
      year: 2015,
      cover_image: "/images/a2cb7913-85f7-42a7-8692-fa4834ae4822.jpg"
    },
    {
      id: "10",
      title: "Bulan ",
      author: "Tere Liye",
      year: 2015,
      cover_image: "/images/2bce1758-c3bb-4b2c-a25e-093d9e7e184c.jpg"
    },
    {
      id: "11",
      title: "Ayat-Ayat Cinta",
      author: "Habiburrahman El Shirazy",
      year: 2004,
      cover_image: "/images/2d7ca44e-30f3-422c-9d21-69fb65c6f530.jpg"
    },
    {
      id: "12",
      title: "Negeri 5 Menara",
      author: " Ahmad Fuadi",
      year: 2009,
      cover_image: "/images/ad97ce9d-3f48-4150-84d2-1a27407b2c60.jpg"
    },
    {
      id: "13",
      title: "Supernova: Ksatria, Puteri, dan Bintang Jatuh",
      author: "Dewi Lestari",
      year: 2001,
      cover_image: "/images/01623fe9-910d-47c8-953c-d51421e069fe.jpg"
    },
  ]);
};

