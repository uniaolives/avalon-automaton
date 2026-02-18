import { describe, it, expect } from 'vitest';
import { Hypergraph } from '../arkhe/hypergraph.js';
import { CMSDarkShower, DarkShowerBDT, PhiUpperLimit } from '../arkhe/cms-physics.js';

describe('CMS Dark Shower Integration', () => {
  it('should simulate a dark shower cascade', () => {
    const h = new Hypergraph();
    const cms = new CMSDarkShower(h);

    cms.simulate();

    // Expect nodes for Higgs, Partons, Mesons and Muons
    const nodes = Array.from(h.nodes.values());
    expect(nodes.some(n => n.data.type === 'Higgs')).toBe(true);
    expect(nodes.some(n => n.data.type === 'DarkParton')).toBe(true);
    expect(nodes.some(n => n.data.type === 'DarkMeson')).toBe(true);
    expect(nodes.some(n => n.data.type === 'Muon')).toBe(true);

    // Expect edges connecting them
    expect(h.edges.length).toBeGreaterThan(5);
  });

  it('should discriminate using BDT', () => {
    const bdt = new DarkShowerBDT();

    expect(bdt.discriminate(0.998, 'vector_portal')).toBe(true);
    expect(bdt.discriminate(0.996, 'vector_portal')).toBe(false);
    expect(bdt.discriminate(0.9991, 'low_mass')).toBe(true);
  });

  it('should compare Phi limits', () => {
    expect(PhiUpperLimit.compare(1e-4)).toContain("Φ_arkhe ~ Φ_cms");
    expect(PhiUpperLimit.compare(0.01)).toContain("Φ_arkhe >> Φ_cms");
  });
});
