import type { ImageMetadata } from "astro";
import OttoLanding from "../images/ottointelligence.jpg";
import MeetOttoLanding from "../images/meetotto.jpg";
import TuiDo from "../images/tuido.png";

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  thumbnail?: ImageMetadata;
  link?: string;
}

export const projects: Project[] = [
  {
    thumbnail: OttoLanding,
    title: "Otto Intelligence App",
    description:
      "Portfolio management app for Otto Intelligence. I was the lead developer.",
    technologies: ["React", "Tailwind"],
  },
  {
    thumbnail: MeetOttoLanding,
    title: "Meet Otto App",
    description: "Custom CRM built for Otto Intelligence.",
    technologies: ["React", "Tailwind", "tRPC"],
  },
  {
    title: "Dang Language",
    description:
      "An interpreter for my own programming language, written in Rust. The syntax started out close to JavaScript and is moving toward TypeScript.",
    link: "https://github.com/danielsyang/dang",
    technologies: ["Rust"],
  },
  {
    thumbnail: TuiDo,
    title: "Tui-Do",
    description: "A terminal to-do app written in Rust, backed by SQLite.",
    link: "https://github.com/danielsyang/tui-do",
    technologies: ["Rust", "SQLite"],
  },
];
