
import { Survey } from './types';

export const DAILY_SURVEY_LIMIT = 3;
export const DAILY_KES_LIMIT = 250;
export const MIN_WITHDRAWAL_KES = 2000;
export const REGISTRATION_FEE_KES = 49;
export const PREMIUM_FEE_KES = 49;
export const ADMIN_PHONE = "0796335209";

export const REWARD_DEDUCTION_RATE = 0.20; // 20% company deduction
export const WITHDRAWAL_DEDUCTION_RATE = 0.15; // 15% withdrawal deduction

export const MOCK_SURVEYS: Survey[] = [
  {
    id: 'geo-01',
    title: 'Global Geography & Cities',
    category: 'Geography',
    questions: [
      { id: 'q1', text: 'Which is the largest country by land area?', options: ['Russia', 'Canada', 'China', 'USA'], correctAnswer: 'Russia' },
      { id: 'q2', text: 'Which city is known as the "Big Apple"?', options: ['Los Angeles', 'New York', 'Chicago', 'Miami'], correctAnswer: 'New York' },
      { id: 'q3', text: 'What is the capital city of Japan?', options: ['Kyoto', 'Osaka', 'Tokyo', 'Nagoya'], correctAnswer: 'Tokyo' },
      { id: 'q4', text: 'Which continent is the Sahara Desert located in?', options: ['Asia', 'South America', 'Africa', 'Australia'], correctAnswer: 'Africa' },
      { id: 'q5', text: 'The Eiffel Tower is located in which city?', options: ['London', 'Berlin', 'Paris', 'Rome'], correctAnswer: 'Paris' },
      { id: 'q6', text: 'Which river is the longest in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correctAnswer: 'Nile' },
      { id: 'q7', text: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'Malta', 'San Marino'], correctAnswer: 'Vatican City' },
      { id: 'q8', text: 'Which country has the most natural lakes?', options: ['USA', 'Canada', 'Russia', 'India'], correctAnswer: 'Canada' },
      { id: 'q9', text: 'Mount Everest is found in which mountain range?', options: ['Andes', 'Alps', 'Himalayas', 'Rockies'], correctAnswer: 'Himalayas' },
      { id: 'q10', text: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 'Pacific' }
    ]
  },
  {
    id: 'sci-01',
    title: 'Modern Science & Tech',
    category: 'Science',
    questions: [
      { id: 'q1', text: 'Who is known as the father of modern physics?', options: ['Newton', 'Einstein', 'Tesla', 'Galileo'], correctAnswer: 'Einstein' },
      { id: 'q2', text: 'What is the boiling point of water at sea level?', options: ['90°C', '100°C', '110°C', '120°C'], correctAnswer: '100°C' },
      { id: 'q3', text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 'Mars' },
      { id: 'q4', text: 'What does DNA stand for?', options: ['Deoxyribonucleic Acid', 'Dinucleic Acid', 'Deribonucleic Acid', 'Deoxynucleic Acid'], correctAnswer: 'Deoxyribonucleic Acid' },
      { id: 'q5', text: 'Who founded SpaceX?', options: ['Jeff Bezos', 'Bill Gates', 'Elon Musk', 'Mark Zuckerberg'], correctAnswer: 'Elon Musk' },
      { id: 'q6', text: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 'Carbon Dioxide' },
      { id: 'q7', text: 'What is the closest star to Earth?', options: ['Sirius', 'Alpha Centauri', 'The Sun', 'Betelgeuse'], correctAnswer: 'The Sun' },
      { id: 'q8', text: 'Which element has the chemical symbol "O"?', options: ['Gold', 'Oxygen', 'Osmium', 'Iron'], correctAnswer: 'Oxygen' },
      { id: 'q9', text: 'Which company developed the iPhone?', options: ['Samsung', 'Google', 'Microsoft', 'Apple'], correctAnswer: 'Apple' },
      { id: 'q10', text: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], correctAnswer: 'Diamond' }
    ]
  },
  {
    id: 'pol-01',
    title: 'Global Politics & History',
    category: 'Politics',
    questions: [
      { id: 'q1', text: 'Who was the first black president of South Africa?', options: ['Desmond Tutu', 'Nelson Mandela', 'Thabo Mbeki', 'Jacob Zuma'], correctAnswer: 'Nelson Mandela' },
      { id: 'q2', text: 'In which year did World War II end?', options: ['1918', '1939', '1945', '1950'], correctAnswer: '1945' },
      { id: 'q3', text: 'Which country is the largest democracy in the world?', options: ['USA', 'India', 'China', 'Brazil'], correctAnswer: 'India' },
      { id: 'q4', text: 'Who is the current President of the USA (as of 2024)?', options: ['Donald Trump', 'Barack Obama', 'Joe Biden', 'George Bush'], correctAnswer: 'Joe Biden' },
      { id: 'q5', text: 'The United Nations is headquartered in which city?', options: ['Geneva', 'New York', 'London', 'Nairobi'], correctAnswer: 'New York' },
      { id: 'q6', text: 'What is the official currency of the United Kingdom?', options: ['Euro', 'Dollar', 'Pound Sterling', 'Yen'], correctAnswer: 'Pound Sterling' },
      { id: 'q7', text: 'Which country colonized Kenya?', options: ['France', 'Germany', 'Britain', 'Portugal'], correctAnswer: 'Britain' },
      { id: 'q8', text: 'What is the voting age in most countries?', options: ['16', '18', '21', '25'], correctAnswer: '18' },
      { id: 'q9', text: 'Who was the primary leader of the Indian independence movement?', options: ['Nehru', 'Modi', 'Mahatma Gandhi', 'Subhas Chandra Bose'], correctAnswer: 'Mahatma Gandhi' },
      { id: 'q10', text: 'What political system allows people to choose their leaders?', options: ['Monarchy', 'Dictatorship', 'Democracy', 'Oligarchy'], correctAnswer: 'Democracy' }
    ]
  },
  {
    id: 'agr-01',
    title: 'Agriculture & Industry',
    category: 'Economy',
    questions: [
      { id: 'q1', text: 'Which country is the leading producer of coffee in the world?', options: ['Kenya', 'Ethiopia', 'Brazil', 'Vietnam'], correctAnswer: 'Brazil' },
      { id: 'q2', text: 'What is the main ingredient in chocolate?', options: ['Sugar', 'Cocoa Beans', 'Milk', 'Vanilla'], correctAnswer: 'Cocoa Beans' },
      { id: 'q3', text: 'The process of growing crops without soil is called?', options: ['Agriculture', 'Hydroponics', 'Irrigation', 'Deforestation'], correctAnswer: 'Hydroponics' },
      { id: 'q4', text: 'Which continent produces the most cocoa?', options: ['South America', 'Asia', 'Africa', 'Europe'], correctAnswer: 'Africa' },
      { id: 'q5', text: 'What is the primary export of many Middle Eastern countries?', options: ['Gold', 'Oil', 'Textiles', 'Grain'], correctAnswer: 'Oil' },
      { id: 'q6', text: 'Which sector does farming belong to?', options: ['Primary', 'Secondary', 'Tertiary', 'Quaternary'], correctAnswer: 'Primary' },
      { id: 'q7', text: 'Industrialization first started in which country?', options: ['USA', 'Germany', 'Great Britain', 'France'], correctAnswer: 'Great Britain' },
      { id: 'q8', text: 'Which crop is often referred to as "White Gold"?', options: ['Rice', 'Cotton', 'Sugar', 'Wheat'], correctAnswer: 'Cotton' },
      { id: 'q9', text: 'What is the term for the large-scale rearing of animals?', options: ['Cropping', 'Ranching', 'Pesticide', 'Harvesting'], correctAnswer: 'Ranching' },
      { id: 'q10', text: 'What is the most consumed grain in the world?', options: ['Corn', 'Wheat', 'Rice', 'Barley'], correctAnswer: 'Rice' }
    ]
  }
];
