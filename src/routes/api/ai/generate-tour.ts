// Server route: stream a generated tour from Lovable AI gateway.
// We use tool-calling so we always get structured JSON back, then forward
// the assistant text chunks as plain SSE for the client.

import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are an expert onboarding designer for hydraulic and drainage modelling software (InfoWorks ICM, ICM SWMM Networks, EPA SWMM5, InfoDrainage, Civil 3D drainage analysis).

Given a product, learner persona, and learning goal, design a step-by-step product tour for a brand-new user. Each step must reference an interactive element in the simulated UI using its data-sim attribute value. Available data-sim selectors are provided in the user prompt — only use IDs from that list.

Write copy that is concrete, friendly, and assumes zero prior knowledge. Avoid filler. Use short sentences. Include domain-correct hydraulic terminology where it adds clarity, and define jargon in the glossary.

Always return your answer by calling the emit_tour function — do not write prose.`;

const TOOL = {
  type: "function" as const,
  function: {
    name: "emit_tour",
    description: "Emit a structured onboarding tour.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short, action-oriented tour title." },
        steps: {
          type: "array",
          minItems: 4,
          maxItems: 10,
          items: {
            type: "object",
            properties: {
              screenId: { type: "string", description: "Screen id from the provided list." },
              targetSim: {
                type: "string",
                description: "data-sim attribute value of the element to highlight. Use null if the step is general.",
              },
              title: { type: "string" },
              body: { type: "string", description: "Markdown body, 1–3 short sentences." },
              action: { type: "string", enum: ["click", "look", "type"] },
            },
            required: ["screenId", "targetSim", "title", "body", "action"],
            additionalProperties: false,
          },
        },
        help: {
          type: "array",
          minItems: 1,
          maxItems: 4,
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              body: { type: "string", description: "Markdown body, 2–6 sentences." },
            },
            required: ["title", "body"],
            additionalProperties: false,
          },
        },
        glossary: {
          type: "array",
          minItems: 2,
          maxItems: 8,
          items: {
            type: "object",
            properties: {
              term: { type: "string" },
              definition: { type: "string" },
            },
            required: ["term", "definition"],
            additionalProperties: false,
          },
        },
      },
      required: ["title", "steps", "help", "glossary"],
      additionalProperties: false,
    },
  },
};

interface Body {
  product: string;
  productLabel: string;
  persona: string;
  goal: string;
  screens: { id: string; label: string; sims: string[] }[];
}

export const Route = createFileRoute("/api/ai/generate-tour")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response("LOVABLE_API_KEY not configured", { status: 500 });
        }
        const body = (await request.json()) as Body;
        if (!body?.product || !body?.goal) {
          return new Response("Missing product or goal", { status: 400 });
        }

        const userPrompt = `Product: ${body.productLabel}
Persona: ${body.persona || "new user"}
Goal: ${body.goal}

Available screens and their interactive data-sim selectors:
${body.screens
  .map(
    (s) =>
      `- screen "${s.id}" (${s.label}): ${s.sims.slice(0, 30).join(", ") || "(none)"}`
  )
  .join("\n")}

Design a 5–8 step tour that delivers the goal. Pull steps from multiple screens when the goal requires it. Each step's targetSim MUST be one of the IDs listed above.`;

        const upstream = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt },
              ],
              tools: [TOOL],
              tool_choice: { type: "function", function: { name: "emit_tour" } },
              stream: true,
            }),
            signal: request.signal,
          }
        );

        if (!upstream.ok || !upstream.body) {
          const t = await upstream.text();
          return new Response(t || "AI gateway error", { status: upstream.status });
        }
        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
