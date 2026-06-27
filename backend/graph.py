"""
LangGraph Orchestration Module

This module defines the StateGraph for the 6-agent pipeline:
1. Behavior Analyzer
2. Life Event Detection
3. Opportunity Discovery
4. Engagement Strategy
5. Action Planning
6. Follow-up
"""
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from agents.behavior_analyzer import behavior_analyzer_node
from agents.life_event_detection import life_event_detection_node
from agents.opportunity_discovery import opportunity_discovery_node
from agents.engagement_strategy import engagement_strategy_node
from agents.action_planning import action_planning_node
from agents.follow_up import follow_up_node

class AgentState(TypedDict):
    customer_id: str
    persona: Dict[str, Any]
    behavior_deltas: List[str]
    life_events: List[Dict[str, Any]]
    opportunities: List[Dict[str, Any]]
    engagement_plan: Dict[str, Any]
    action_steps: List[Dict[str, Any]]
    follow_up_schedule: Dict[str, Any]
    messages: List[str]

def create_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("behavior_analyzer", behavior_analyzer_node)
    workflow.add_node("life_event_detection", life_event_detection_node)
    workflow.add_node("opportunity_discovery", opportunity_discovery_node)
    workflow.add_node("engagement_strategy", engagement_strategy_node)
    workflow.add_node("action_planning", action_planning_node)
    workflow.add_node("follow_up", follow_up_node)
    
    workflow.set_entry_point("behavior_analyzer")
    workflow.add_edge("behavior_analyzer", "life_event_detection")
    workflow.add_edge("life_event_detection", "opportunity_discovery")
    workflow.add_edge("opportunity_discovery", "engagement_strategy")
    workflow.add_edge("engagement_strategy", "action_planning")
    workflow.add_edge("action_planning", "follow_up")
    workflow.add_edge("follow_up", END)
    
    return workflow.compile()
