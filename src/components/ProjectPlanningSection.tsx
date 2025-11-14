"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, GitPullRequest, CalendarDays, Users, ShieldAlert } from 'lucide-react';

const projectPlanningData = [
  {
    icon: Target,
    title: "Objective",
    description: "Clearly define the project's goals and success metrics.",
    details: [
      "Enhance urban mobility efficiency.",
      "Reduce traffic congestion by 15% in key areas.",
      "Improve incident response times by 20%."
    ]
  },
  {
    icon: GitPullRequest,
    title: "Scope",
    description: "Outline project boundaries and expected deliverables.",
    details: [
      "Develop a real-time traffic monitoring system.",
      "Integrate AI for predictive analysis.",
      "Provide interactive dashboards and reporting tools."
    ]
  },
  {
    icon: CalendarDays,
    title: "Timeline",
    description: "Establish key milestones and deadlines for each phase.",
    details: [
      "Phase 1 (Data Collection & Integration): 3 months.",
      "Phase 2 (AI Model Development): 4 months.",
      "Phase 3 (Dashboard & Reporting): 2 months.",
      "Phase 4 (Deployment & Testing): 1 month."
    ]
  },
  {
    icon: Users,
    title: "Resources",
    description: "Identify required personnel, budget, tools, and materials.",
    details: [
      "Team: Data Scientists, Software Engineers, UI/UX Designers.",
      "Budget: €500,000 for development and infrastructure.",
      "Tools: Cloud computing, sensor hardware, data visualization libraries."
    ]
  },
  {
    icon: ShieldAlert,
    title: "Risk Assessment",
    description: "Anticipate potential challenges and mitigation strategies.",
    details: [
      "Data privacy concerns: Implement robust encryption and anonymization.",
      "Technical integration issues: Use modular architecture and APIs.",
      "Budget overruns: Regular financial reviews and contingency planning."
    ]
  },
];

interface ProjectPlanningSectionProps {
  id?: string;
}

const ProjectPlanningSection: React.FC<ProjectPlanningSectionProps> = React.memo(({ id }) => {
  return (
    <div id={id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projectPlanningData.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
                <Icon className="h-5 w-5 mr-2 text-indigo-600" /> {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300 text-sm">{item.description}</p>
              <ul className="list-disc list-inside pl-4 text-gray-600 dark:text-gray-400 text-sm space-y-1">
                {item.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

export default ProjectPlanningSection;