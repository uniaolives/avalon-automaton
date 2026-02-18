import { Hypergraph } from './hypergraph.js';
import { ArkheNode } from './types.js';
import { ulid } from 'ulid';

/**
 * CMS Dark Shower Simulation as a Cascade Hypergraph.
 * Isomorphism based on CMS EXO-24-008.
 */
export class CMSDarkShower {
  constructor(public h: Hypergraph) {}

  /**
   * Simulates a Higgs decay into a dark shower cascade.
   */
  public simulate(branchingFraction: number = 1e-4): void {
    // Stage 0: Higgs Node
    const higgs = this.h.addNode(undefined, { type: 'Higgs', mass: 125 });

    // Stage 1: Dark Partons (Handover from Higgs)
    const parton1 = this.h.addNode(undefined, { type: 'DarkParton' });
    const parton2 = this.h.addNode(undefined, { type: 'DarkParton' });
    this.h.addEdge(new Set([higgs.id, parton1.id, parton2.id]), 1.0);

    // Stage 2: Hadronization into Dark Mesons (Fractal Recursion)
    const darkMesons: ArkheNode[] = [];
    const nMesons = 5; // simplified poisson mean
    for (let i = 0; i < nMesons; i++) {
      const meson = this.h.addNode(undefined, {
        type: 'DarkMeson',
        isLongLived: Math.random() > 0.1
      });
      darkMesons.push(meson);
      // Handover from partons to mesons
      this.h.addEdge(new Set([parton1.id, meson.id]), 0.8);
      this.h.addEdge(new Set([parton2.id, meson.id]), 0.8);
    }

    // Stage 3: Non-prompt decay to Muons (Observed Handover)
    for (const meson of darkMesons) {
      if (meson.data.isLongLived) {
        const muon1 = this.h.addNode(undefined, { type: 'Muon', prompt: false });
        const muon2 = this.h.addNode(undefined, { type: 'Muon', prompt: false });
        const lxy = Math.random() * 50; // displacement in cm

        const edge = this.h.addEdge(new Set([meson.id, muon1.id, muon2.id]), 0.95);
        edge.metadata = {
          lxy,
          pointingAngle: Math.random() * 0.5,
          invariantMass: 2.0 + Math.random() * 10
        };
      }
    }

    this.h.bootstrapStep();
  }
}

/**
 * BDT (Boosted Decision Tree) as a Kernel Consensus implementation.
 */
export class DarkShowerBDT {
  private thresholds = {
    vector_portal: 0.997,
    low_mass: 0.999
  };

  /**
   * Discriminate signal from background based on handover coherence.
   */
  public discriminate(coherence: number, model: 'vector_portal' | 'low_mass' = 'vector_portal'): boolean {
    return coherence > this.thresholds[model];
  }
}

/**
 * CMS Upper Limits as measure of Phi (Integrated Information).
 */
export class PhiUpperLimit {
  public static compare(limit: number): string {
    // In Arkhe(n), Phi ~ 0.006 is frequent.
    // CMS limits of 10^-4 are rare handovers.
    return limit < 0.001 ? "Φ_arkhe ~ Φ_cms (Rare)" : "Φ_arkhe >> Φ_cms (Frequent)";
  }
}
