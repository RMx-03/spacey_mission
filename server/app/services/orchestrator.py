from typing import Any, Dict

from langgraph.graph import StateGraph, END
from typing_extensions import TypedDict


class OrchestratorState(TypedDict, total=False):
    user_message: str
    route: str
    response: str


def _classify_intent(state: OrchestratorState) -> OrchestratorState:
    message = state.get("user_message", "")
    # TODO: replace with model-based classifier
    route = "quiz" if any(k in message.lower() for k in ["quiz", "test"]) else "explain"
    state["route"] = route
    return state


def _node_explain(state: OrchestratorState) -> OrchestratorState:
    state["response"] = f"Explaining: {state.get('user_message','')}"
    return state


def _node_quiz(state: OrchestratorState) -> OrchestratorState:
    state["response"] = "Let's try a quick quiz question related to your topic."
    return state


def build_graph():
    graph = StateGraph(OrchestratorState)
    graph.add_node("classify", _classify_intent)
    graph.add_node("explain", _node_explain)
    graph.add_node("quiz", _node_quiz)

    graph.set_entry_point("classify")
    graph.add_conditional_edges(
        "classify",
        lambda s: s.get("route", "explain"),
        {
            "explain": "explain",
            "quiz": "quiz",
        },
    )
    graph.add_edge("explain", END)
    graph.add_edge("quiz", END)
    return graph.compile()


compiled_graph = build_graph()


def run_orchestrator(user_message: str) -> Dict[str, Any]:
    result = compiled_graph.invoke({"user_message": user_message})
    return {"route": result.get("route"), "response": result.get("response")}


