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
      description:
        "Novel ini menceritakan kisah cinta Juang Astrajingga dan Ana Tidae yang penuh rintangan, dengan pesan tentang kemanusiaan dan cinta.",
      cover_image: "/src/public/images/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
    },
    {
      id: 2,
      title: "Pulang - Pergi",
      author: "Tere Liye",
      description:
        "Bujang harus kembali berpetualang setelah menerima pesan dari pemimpin Bratva, menghadapi ancaman dan dilema perjodohan.",
      cover_image: "/src/public/images/98765432-1abc-4def-89ab-0123456789cd.jpg",
    },
    {
      id: 3,
      title: "33 Strategi Kekuasaan",
      author: "Robert Greene",
      description:
        "Panduan praktis untuk memahami strategi kekuasaan, membangun pengaruh, dan menghadapi persaingan dengan cerdas.",
      cover_image: "/src/public/images/3f7f44c2-8a4b-4b9a-80db-4d8f7e289b3c.jpg",
    },
  ]);
};

