import React from "react";
import { Question, Option } from "./types";
import { ReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

interface QuizFlowDiagramProps {
  questions: Question[];
}

function QuizFlowDiagram({ questions }: QuizFlowDiagramProps) {
  let nodes: any[] = [];
  let edges: any[] = [];

  questions.forEach((question: Question) => {
    // Add question node
    const questionNode = {
      id: question.id,
      type: "default",
      data: { label: question.title },
      position: { x: Math.random() * 1000, y: Math.random() * 1000 }, // For demo purposes
    };
    nodes.push(questionNode);

    // Add edges for each option
    question.options.forEach((option: Option) => {
      if (option.nextQuestionId) {
        const edge = {
          id: `e${question.id}-${option.nextQuestionId}`,
          source: question.id,
          target: option.nextQuestionId,
          type: "smoothstep",
          animated: true,
          label: option.title,
        };
        edges.push(edge);
      }
    });
  });

  return (
    <div style={{ height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}

export default QuizFlowDiagram;
