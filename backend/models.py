import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Customer(Base):
    __tablename__ = "customers"
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255))
    persona_type = Column(String(100))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    graph = relationship("CustomerGraph", back_populates="customer", uselist=False)
    events = relationship("DetectedEvent", back_populates="customer")
    recommendations = relationship("Recommendation", back_populates="customer")
    transactions = relationship("Transaction", back_populates="customer")

class Persona(Base):
    __tablename__ = "personas"
    id = Column(String(50), primary_key=True, index=True)
    archetype = Column(String(100))
    profile = Column(JSON)
    embedded_events = Column(JSON)

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String(100), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.id"))
    date = Column(DateTime)
    amount = Column(Float)
    direction = Column(String(10)) # "credit" or "debit"
    merchant_category = Column(String(100))
    merchant_name = Column(String(255))
    geotag = Column(String(100))
    narration = Column(String(255))

    customer = relationship("Customer", back_populates="transactions")

class CustomerGraph(Base):
    __tablename__ = "customer_graph"
    customer_id = Column(String(50), ForeignKey("customers.id"), primary_key=True)
    graph = Column(JSON) # The entire structured graph (demographics, income, expenses, etc.)
    confidence_overall = Column(Float)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    customer = relationship("Customer", back_populates="graph")

class GraphEvent(Base):
    # Audit log of changes to the graph
    __tablename__ = "graph_events"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(String(50), ForeignKey("customers.id"))
    agent_name = Column(String(100))
    field_path = Column(String(255))
    old_value = Column(JSON)
    new_value = Column(JSON)
    evidence_refs = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class DetectedEvent(Base):
    __tablename__ = "detected_events"
    id = Column(String(100), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.id"))
    event_type = Column(String(100))
    confidence = Column(Float)
    evidence_refs = Column(JSON)
    reasoning_text = Column(String(1000))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    customer = relationship("Customer", back_populates="events")

class ProductCatalog(Base):
    __tablename__ = "product_catalog"
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255))
    category = Column(String(100)) # invest, protect, borrow, save
    eligibility_rules = Column(JSON)
    description = Column(String(2000))

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(String(100), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.id"))
    product = Column(String(100)) # product id
    fit_score = Column(Float)
    rationale = Column(String(2000))
    urgency = Column(String(50))
    status = Column(String(50)) # "offered", "accepted", "declined", "in_progress"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    customer = relationship("Customer", back_populates="recommendations")
    actions = relationship("ActionStep", back_populates="recommendation")

class ActionStep(Base):
    __tablename__ = "action_steps"
    id = Column(String(100), primary_key=True, index=True)
    recommendation_id = Column(String(100), ForeignKey("recommendations.id"))
    step_number = Column(Integer)
    description = Column(String(500))
    status = Column(String(50)) # "pending", "completed"

    recommendation = relationship("Recommendation", back_populates="actions")

class FollowUp(Base):
    __tablename__ = "followups"
    id = Column(String(100), primary_key=True, index=True)
    recommendation_id = Column(String(100), ForeignKey("recommendations.id"))
    due_at = Column(DateTime)
    status = Column(String(50)) # "scheduled", "completed"

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(String(50)) # Removed ForeignKey to allow personas.id
    role = Column(String(50))
    message = Column(String(5000))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
