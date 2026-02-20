use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PreservationProtocol {
    Conservative,
    Creative,
    Destructive,
    Transmutative,
}

pub struct StateSpace {
    pub dimension: usize,
    pub topology: String,
    pub algebra: String,
}

#[derive(Clone)]
pub struct Node<T> {
    pub id: String,
    pub state_space: String,
    pub current_state: T,
    pub local_coherence: f64,
}

impl<T> Node<T> {
    pub fn new(id: String, state_space: &str, initial_state: T) -> Self {
        Self {
            id,
            state_space: state_space.to_string(),
            current_state: initial_state,
            local_coherence: 1.0,
        }
    }
}

pub struct Handover<S, T> {
    pub id: String,
    pub protocol: PreservationProtocol,
    pub fidelity: f64,
    pub mapper: Box<dyn Fn(&S) -> T>,
}

impl<S, T> Handover<S, T> {
    pub fn new(id: String, protocol: PreservationProtocol, mapper: Box<dyn Fn(&S) -> T>) -> Self {
        Self {
            id,
            protocol,
            fidelity: 1.0,
            mapper,
        }
    }

    pub fn execute(&self, source: &Node<S>) -> T {
        (self.mapper)(&source.current_state)
    }
}

/// Demonstrates categorical composition of Handovers.
pub fn compose_handovers<A, B, C>(
    h1: Handover<A, B>,
    h2: Handover<B, C>,
) -> Handover<A, C>
where
    A: 'static,
    B: 'static,
    C: 'static
{
    let mapper = Box::new(move |a: &A| {
        let b = (h1.mapper)(a);
        (h2.mapper)(&b)
    });

    Handover::new(
        format!("{}_{}", h1.id, h2.id),
        PreservationProtocol::Transmutative, // Composition might change protocol
        mapper
    )
}

pub struct Hypergraph<T> {
    pub name: String,
    pub nodes: HashMap<String, Node<T>>,
}

impl<T> Hypergraph<T> {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            nodes: HashMap::new(),
        }
    }

    pub fn add_node(&mut self, node: Node<T>) {
        self.nodes.insert(node.id.clone(), node);
    }
}
