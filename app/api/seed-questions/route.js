import connectDB from "../../../lib/mongodb";
import Question from "../../../models/Question";
import { NextResponse } from "next/server";

const dummyQuestions = [
  // Reasoning
  {
    id: "r1",
    question: "If A = 1, BAN = 17, then what is INDIA = ?",
    options: ["37", "38", "39", "40"],
    correct: "37",
    section: "Reasoning",
  },
  {
    id: "r2",
    question: "Find the odd one out: Tomato, Potato, Carrot, Ginger",
    options: ["Tomato", "Potato", "Carrot", "Ginger"],
    correct: "Tomato",
    section: "Reasoning",
  },
  {
    id: "r3",
    question: "If A = 1, BAN = 17, then what is the value of INDIA?",
    options: ["36", "37", "38", "39"],
    correct: "37",
    section: "Reasoning",
  },
  {
    id: "r4",
    question: "Find the odd one out: Tomato, Potato, Carrot, Ginger",
    options: ["Tomato", "Potato", "Carrot", "Ginger"],
    correct: "Tomato",
    section: "Reasoning",
  },
  {
    id: "r5",
    question: "If A = 1, BAN = 17, then what is the value of INDIA?",
    options: ["36", "37", "38", "39"],
    correct: "37",
    section: "Reasoning",
  },
  {
    id: "r6",
    question: "Find the odd one out: Tomato, Potato, Carrot, Ginger",
    options: ["Tomato", "Potato", "Carrot", "Ginger"],
    correct: "Tomato",
    section: "Reasoning",
  },
  // General Awareness
  {
    id: "g1",
    question: "Who is known as the Father of Indian Constitution?",
    options: [
      "Mahatma Gandhi",
      "Dr. B.R. Ambedkar",
      "Jawaharlal Nehru",
      "Subhash Chandra Bose",
    ],
    correct: "Dr. B.R. Ambedkar",
    section: "General Awareness",
  },
  {
    id: "g2",
    question: 'Select the synonym of "ABANDON":',
    options: ["Keep", "Forsake", "Cherish", "Adopt"],
    correct: "Forsake",
    section: "General Awareness",
  },
  {
    id: "g3",
    question: "Who is known as the Father of Indian Constitution?",
    options: [
      "Mahatma Gandhi",
      "Dr. B.R. Ambedkar",
      "Jawaharlal Nehru",
      "Subhas Chandra Bose",
    ],
    correct: "Dr. B.R. Ambedkar",
    section: "General Awareness",
  },
  {
    id: "g4",
    question: 'Select the synonym of "ABANDON":',
    options: ["Keep", "Forsake", "Cherish", "Adopt"],
    correct: "Forsake",
    section: "General Awareness",
  },
  {
    id: "g5",
    question: "Who is known as the Father of Indian Constitution?",
    options: [
      "Mahatma Gandhi",
      "Dr. B.R. Ambedkar",
      "Jawaharlal Nehru",
      "Subhas Chandra Bose",
    ],
    correct: "Dr. B.R. Ambedkar",
    section: "General Awareness",
  },
  {
    id: "g6",
    question: 'Select the synonym of "ABANDON":',
    options: ["Keep", "Forsake", "Cherish", "Adopt"],
    correct: "Forsake",
    section: "General Awareness",
  },

  // Quantitative Aptitude
  {
    id: "q1",
    question: "A shopkeeper sells a product at 10% loss and sold it for 180 more, he would have gained 10%. Find CP.",
    options: ["5000", "6000", "5500", "900"],
    correct: "900",
    section: "Quantitative Aptitude",
  },
  {
    id: "q2",
    question: "The average of 5 consecutive numbers is 24. Find the largest number.",
    options: ["22", "24", "20", "26"],
    correct: "26",
    section: "Quantitative Aptitude",
  },
  {
    id: "q3",
    question: "A shopkeeper sells a product at 10% loss and sold it for 180 more, he would have gained 10%. Find CP.",
    options: ["5000", "6000", "5500", "900"],
    correct: "900",
    section: "Quantitative Aptitude",
  },
  {
    id: "q4",
    question: "The average of 5 consecutive numbers is 24. Find the largest number.",
    options: ["22", "24", "20", "26"],
    correct: "26",
    section: "Quantitative Aptitude",
  },

  // English..
  {
    id: "e1",
    question: 'Select the synonym of "ABANDON":',
    options: ["Keep", "Forsake", "Cherish", "Adopt"],
    correct: "Forsake",
    section: "English",
  },
  {
    id: "e2",
    question: "Who is known as the Father of Indian Constitution?",
    options: [
      "Mahatma Gandhi",
      "Dr. B.R. Ambedkar",
      "Jawaharlal Nehru",
      "Subhas Chandra Bose",
    ],
    correct: "Dr. B.R. Ambedkar",
    section: "English",
  },
  {
    id: "e3",
    question: 'Select the synonym of "ABANDON":',
    options: ["Keep", "Forsake", "Cherish", "Adopt"],
    correct: "Forsake",
    section: "English",
  },
  {
    id: "e4",
    question: "Who is known as the Father of Indian Constitution?",
    options: [
      "Mahatma Gandhi",
      "Dr. B.R. Ambedkar",
      "Jawaharlal Nehru",
      "Subhas Chandra Bose",
    ],
    correct: "Dr. B.R. Ambedkar",
    section: "English",
  },
  {
    id: "e5",
    question: 'Select the synonym of "ABANDON":',
    options: ["Keep", "Forsake", "Cherish", "Adopt"],
    correct: "Forsake",
    section: "English",
  },
  {
    id: "e6",
    question: "Who is known as the Father of Indian Constitution?",
    options: [
      "Mahatma Gandhi",
      "Dr. B.R. Ambedkar",
      "Jawaharlal Nehru",
      "Subhas Chandra Bose",
    ],
    correct: "Dr. B.R. Ambedkar",
    section: "English",
  },
];

export async function GET() {
  try {
    await connectDB();

    // Pehle se agar koi purana dummy data ho toh use saaf karo taaki duplicate na ho
    await Question.deleteMany({});

    // Naya saara data ek saath cloud database mein insert karo
    await Question.insertMany(dummyQuestions);

    return NextResponse.json({
      success: true,
      message:
        "Congratulations! All Questions are now safely inserted in the cloud database. 🚀",
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
