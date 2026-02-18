import { Hypergraph } from './hypergraph.js';

export interface Handover {
  fromNode: string;
  toNode: string;
  weight: number;
  type: string;
  timestamp: number;
  data?: any;
}

/**
 * Handover Module - Manages structured transfers of information and coherence contribution.
 */
export class HandoverManager {
  public handovers: Handover[] = [];

  constructor(private h: Hypergraph) {}

  /**
   * Processes a handover between two nodes.
   */
  public processHandover(fromNode: string, toNode: string, weight: number, type: string, data?: any): Handover {
    if (!this.h.nodes.has(fromNode) || !this.h.nodes.has(toNode)) {
      throw new Error(`Nodes ${fromNode} or ${toNode} do not exist in hypergraph`);
    }

    const handover: Handover = {
      fromNode,
      toNode,
      weight,
      type,
      timestamp: Date.now(),
      data,
    };

    this.handovers.push(handover);

    // Reflect the handover in the hypergraph as an edge
    this.h.addEdge(new Set([fromNode, toNode]), weight);

    return handover;
  }

  public getHandoversForNode(nodeId: string): Handover[] {
    return this.handovers.filter(h => h.fromNode === nodeId || h.toNode === nodeId);
  }

  public countActiveHandovers(nodeId: string): number {
    return this.getHandoversForNode(nodeId).length;
  }
}
