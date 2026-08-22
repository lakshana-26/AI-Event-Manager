"""
RAG Engine Module
Retrieval-Augmented Generation for campus rules, curfews, capacity policies, and logistical guidelines.
"""

import json
import os
import re
from typing import Dict, List, Any

UI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "UI"))
RULES_FILE = os.path.join(UI_DIR, "rules.json")


class CampusRAGEngine:
    def __init__(self):
        self.rules = self._load_rules()

    def _load_rules(self) -> List[Dict[str, Any]]:
        try:
            with open(RULES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def query(self, query_text: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Keyword and semantic scoring over RAG texts and policy parameters.
        """
        tokens = set(re.findall(r'\w+', query_text.lower()))
        scored = []

        for rule in self.rules:
            text = f"{rule.get('title', '')} {rule.get('description', '')} {rule.get('rag_text', '')} {rule.get('category', '')}".lower()
            # Calculate match score
            score = sum(2 for t in tokens if t in text and len(t) > 3)
            # Bonus for exact category match
            if rule.get("category", "").lower() in query_text.lower():
                score += 5
            scored.append((score, rule))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = [r for _, r in scored[:top_k]]
        return results

    def get_citations(self, topic: str) -> List[str]:
        matches = self.query(topic, top_k=2)
        return [f"[{m.get('rule_id')}]: {m.get('rag_text')}" for m in matches]


rag_engine = CampusRAGEngine()
