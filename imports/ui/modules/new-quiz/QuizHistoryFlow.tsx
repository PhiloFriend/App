// QuizHistoryFlow.tsx

import React, { useEffect, useState } from "react";
import { HistoryNode } from "./types";

import { ReactFlow, Position, Node, Edge } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { Subscription } from "rxjs";
import { QuizService } from "./QuizService";

interface QuizHistoryFlowProps {
  quizService: QuizService;
}

const nodeWidth = 200;
const nodeHeight = 50;
const verticalSpacing = 100;
const horizontalSpacing = 250;

const QuizHistoryFlow: React.FC<QuizHistoryFlowProps> = ({ quizService }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const subscription: Subscription = quizService.historySubject.subscribe(
      (historyTree) => {
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        const nodeIds = new Map<HistoryNode, string>(); // Map to keep track of node IDs

        let nodeIdCounter = 0;

        const traverse = (
          node: HistoryNode,
          depth: number = 0,
          yPos: number = 0,
          parentId: string | null = null
        ) => {
          if (!node) return;

          let nodeId = nodeIds.get(node);

          if (!nodeId) {
            // Assign a unique ID to the node
            nodeId = `node_${nodeIdCounter++}`;
            nodeIds.set(node, nodeId);

            // Determine label based on node type
            const label =
              node.type === "question"
                ? node.question.title
                : node.selectedOption.title;

            // Add the node
            newNodes.push({
              id: nodeId,
              data: { label },
              position: { x: depth * horizontalSpacing, y: yPos },
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
              style: { width: nodeWidth },
            });

            // Connect to parent node
            if (parentId) {
              newEdges.push({
                id: `e${parentId}-${nodeId}`,
                source: parentId,
                target: nodeId,
                type: "smoothstep",
              });
            }
          }

          let newParentId = nodeId;

          // Traverse child nodes
          node.children.forEach((childNode, index) => {
            const childYPos = yPos + index * verticalSpacing * 2; // Adjust vertical spacing
            traverse(childNode, depth + 1, childYPos, newParentId);
          });
        };

        traverse(historyTree);

        setNodes(newNodes);
        setEdges(newEdges);
      }
    );

    // Cleanup on unmount
    return () => subscription.unsubscribe();
  }, [quizService]);

  const answerArray = nodes.reduce((a: any, b: any, i: any) => {
    if (i % 2 === 0) {
      const currentNode = nodes[i];
      const nextNode = nodes[i + 1];

      if (currentNode && nextNode) {
        return [...a, [currentNode.data.label, nextNode.data.label].join(" ")];
      }
      return a;
    } else {
      return a;
    }
  }, []);

  console.log(answerArray.join(", "));

  return (
    <div style={{ height: "500px", border: "1px solid #ddd" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
};

export default QuizHistoryFlow;
