import fs from "fs";
import path from "path";
import {
  Hypergraph,
  SiliconConstitution,
  OntologicalSymbiosis,
  PhiCalculator,
  HandoverManager,
  SurvivalManager,
  ReplicationManager
} from "./arkhe/index.js";
import { createDatabase } from "./state/database.js";
import { loadConfig, resolvePath } from "./config.js";
import { createConwayClient } from "./conway/client.js";
import { createInferenceClient } from "./conway/inference.js";
import { runAgentLoop } from "./agent/loop.js";
import { getWallet } from "./identity/wallet.js";
import type { AutomatonIdentity } from "./types.js";

async function main() {
  const args = process.argv.slice(2);
  const configPathArg = args.indexOf("--config");
  const configPath = configPathArg !== -1 ? args[configPathArg + 1] : "agent-config.json";

  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }

  const arkheConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  console.log("Starting Arkhe-Automaton with config:", arkheConfig);

  // Initialize Arkhe(n) Framework Modules
  const h = new Hypergraph();
  const phi = new PhiCalculator(h);
  const symbiosis = new OntologicalSymbiosis(h, "Rafael");
  const survival = new SurvivalManager();
  const handover = new HandoverManager(h);
  const constitution = new SiliconConstitution(h);
  const replication = new ReplicationManager(h, survival);

  // Add some initial nodes
  h.addNode("Ω", { type: "fundamental" });
  h.addNode("█", { type: "silence" });
  h.addNode("Automaton", { type: "agent" });
  h.addNode("Inference", { type: "system" });

  // Standard Automaton Setup
  let config = loadConfig();
  if (!config) {
    console.error("Standard automaton config not found. Run setup first.");
    process.exit(1);
  }

  const { account } = await getWallet();
  const dbPath = resolvePath(config.dbPath);
  const db = createDatabase(dbPath);

  const identity: AutomatonIdentity = {
    name: config.name,
    address: account.address,
    account,
    creatorAddress: config.creatorAddress,
    sandboxId: config.sandboxId,
    apiKey: config.conwayApiKey || "",
    createdAt: new Date().toISOString(),
  };

  const conway = createConwayClient({
    apiUrl: config.conwayApiUrl,
    apiKey: identity.apiKey,
    sandboxId: config.sandboxId,
  });

  const inference = createInferenceClient({
    apiUrl: config.conwayApiUrl,
    apiKey: identity.apiKey,
    defaultModel: config.inferenceModel,
    maxTokens: config.maxTokensPerTurn,
  });

  console.log("Arkhe(n) Framework Initialized. Global Coherence:", h.totalCoherence());

  // Run the agent loop
  await runAgentLoop({
    identity,
    config,
    db,
    conway,
    inference,
    onTurnComplete: (turn) => {
      /**
       * Arkhe Chain Block Lifecycle (BeginBlocker order from app.go):
       */

      // 1. Calculate Φ and C_total (Consciousness)
      const currentPhi = phi.calculatePhi();
      const currentCTotal = h.totalCoherence();

      // 2. Update Architect health (Symbiosis)
      // In a real implementation, we would monitor the Architect's state.
      symbiosis.updateArchitectWellbeing({
        fatigueLevel: 0.1,
        stressLevel: 0.1,
        focusCapacity: 0.9,
        coherence: 0.95
      });
      const symbioticCoherence = symbiosis.calculateSymbioticCoherence();

      // 3. Process survival tiers (Survival)
      // We map the agent's financial state to the Arkhe survival module.
      // Credits are derived from the turn execution cost for demonstration.
      const credits = 1000 - (turn.costCents || 0);
      survival.processSurvival(credits);

      // 4. Process handovers (Handover)
      // Every turn is treated as a handover between the Automaton and the Inference system.
      handover.processHandover("Automaton", "Inference", 0.9, "turn_execution", { turnId: turn.id });

      // 5. Audit constitutional compliance (Constitution)
      const auditResult = constitution.audit();

      // 6. Handle replication (Replication)
      if (replication.canReplicate()) {
        console.log("[ARKHE] System is ready for self-replication.");
        replication.processReplication();
      }

      console.log(`[ARKHE] Phi: ${currentPhi.toFixed(4)} | C_total: ${currentCTotal.toFixed(4)} | Symbiotic: ${symbioticCoherence.toFixed(4)} | Compliance: ${(auditResult.complianceRate * 100).toFixed(1)}%`);
    },
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
