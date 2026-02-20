(* ARKHE(N) CATEGORICAL PROPERTIES v0.1 *)
(* Formalization of Nodes as Objects and Handovers as Morphisms *)

Require Import Coq.Lists.List.
Import ListNotations.

Section ArkheCategory.

  Variable Node : Type.
  Variable Handover : Node -> Node -> Type.

  (* Identity handover: a node always has a reflexive relationship with itself *)
  Variable id_handover : forall (n : Node), Handover n n.

  (* Composition: two handovers can be composed if they share a target/source *)
  Variable compose : forall {n1 n2 n3 : Node},
    Handover n1 n2 -> Handover n2 n3 -> Handover n1 n3.

  (* Axiom: Associativity of handovers *)
  Hypothesis handover_assoc : forall {n1 n2 n3 n4 : Node}
    (h1 : Handover n1 n2) (h2 : Handover n2 n3) (h3 : Handover n3 n4),
    compose h1 (compose h2 h3) = compose (compose h1 h2) h3.

  (* Axiom: Identity law *)
  Hypothesis id_left : forall {n1 n2 : Node} (h : Handover n1 n2),
    compose (id_handover n1) h = h.

  Hypothesis id_right : forall {n1 n2 : Node} (h : Handover n1 n2),
    compose h (id_handover n2) = h.

End ArkheCategory.
