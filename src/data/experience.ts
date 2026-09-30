export interface Job {
  period: string;
  position: string;
  company: string;
  description?: string;
  technologies?: string[];
}

export const experience: Job[] = [
  {
    period: "2024 – Present",
    position: "Senior Software Engineer",
    company: "Replicant",
  },
  {
    period: "2023 – 2024",
    position: "Senior Software Engineer",
    company: "Openscreen",
    description:
      "Architected the sales app on AWS (Node.js, DynamoDB, serverless) and integrated Stripe payments into the core product.",
    technologies: [
      "AWS",
      "Node.js",
      "DynamoDB",
      "Stripe",
      "Serverless",
      "AWS CDK",
    ],
  },
  {
    period: "2021 – 2023",
    position: "Senior Software Engineer",
    company: "Otto Intelligence",
    description:
      "First and only engineer. Built the advisor dashboard and gamified surveys, migrated the MVP, and designed the AWS backend infrastructure in Terraform.",
    technologies: [
      "AWS",
      "Node.js",
      "DynamoDB",
      "GraphQL",
      "PostgreSQL",
      "React",
      "Terraform",
    ],
  },
  {
    period: "2020 – 2021",
    position: "Software Engineer",
    company: "Shipa",
    description:
      "Migrated the legacy JavaScript codebase to TypeScript, set up the company's first Terraform projects, and built the user registration backend with NestJS on AWS.",
    technologies: ["TypeScript", "NestJS", "Serverless", "PostgreSQL"],
  },
  {
    period: "2018 – 2020",
    position: "Software Engineer",
    company: "SkipTheDishes",
    description:
      "Designed a real-time chat system with GraphQL and Redis, introduced micro-frontends in React, maintained the Node.js chat API, and built internal operations dashboards.",
    technologies: ["Node.js", "React", "Redux", "GraphQL", "Redis", "Java"],
  },
  {
    period: "2017 – 2018",
    position: "Front-end Software Engineer",
    company: "iCasei",
    description:
      "Led front-end development on the main dashboard, building features in AngularJS and SASS on a Rails app, following Material Design.",
    technologies: ["AngularJS", "SASS", "Rails", "Material Design"],
  },
];
