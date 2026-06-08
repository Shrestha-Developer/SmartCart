import os
from datetime import datetime
from .recommender import RecommendationEngine

class ReportGenerator:
    @staticmethod
    def generate_user_report(engine: RecommendationEngine, user_id: str, top_n: int = 5) -> str:
        """
        Generates a comprehensive markdown report for a user's recommendations.
        Saves it in outputs/ directory and returns the path.
        """
        user = engine.get_user(user_id)
        if not user:
            return ""

        recs = engine.generate_recommendations(user_id, top_n)
        
        # Build report content
        content = []
        content.append(f"# E-Commerce Recommendation Report: {user.name}")
        content.append(f"**Date Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        content.append(f"**User ID:** `{user.id}`\n")
        
        content.append("## 👤 User Interaction Profile")
        content.append(f"* **Purchases:** {', '.join([f'`{pid}`' for pid in user.purchase_history]) if user.purchase_history else 'None'}")
        content.append(f"* **Active Search History Tags:** {', '.join([f'`{tag}`' for tag in user.search_history]) if user.search_history else 'None'}")
        content.append(f"* **Items in Shopping Cart:** {', '.join([f'`{pid}`' for pid in user.cart]) if user.cart else 'Empty'}")
        content.append(f"* **User Ratings HashMap:** `{dict(user.ratings)}` \n")

        content.append("## 🎯 Top Recommended Products (Hybrid Ranking)")
        content.append("| Rank | Product ID | Name | Category | Price | Match Score | Recommendation Reason |")
        content.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
        
        for rank, (prod_id, score, reason) in enumerate(recs, 1):
            prod = engine.get_product(prod_id)
            if prod:
                content.append(
                    f"| {rank} | `{prod.id}` | {prod.name} | {prod.category} | ${prod.price:.2f} | {score * 100:.1f}% | {reason} |"
                )
        content.append("\n")

        content.append("## 🔍 Tag-based Product Similarity")
        content.append("Similar items in catalog for products currently in user's cart:")
        
        found_similar = False
        for cart_item in user.cart:
            similar_items = engine.get_similar_products(cart_item, top_n=2)
            if similar_items:
                found_similar = True
                content.append(f"### Because you have `{cart_item}` ({engine.get_product(cart_item).name}) in your cart:")
                for sim_id, score in similar_items:
                    sim_prod = engine.get_product(sim_id)
                    if sim_prod:
                        content.append(f"* **`{sim_prod.id}`** - {sim_prod.name} (Similarity: {score*100:.1f}% | Category: {sim_prod.category})")
        if not found_similar:
            content.append("*No items in cart to compare.*")
        content.append("\n")

        content.append("## ⚙️ DSA Computational Complexity Analysis")
        content.append("This recommendation engine utilizes optimized algorithms to scale on production systems:")
        content.append("1. **O(1) Data Access:** User and Product profiles are queried in constant time using HashMaps.")
        content.append("2. **O(U + I) Jaccard Similarity:** Set-based intersection and union operations calculate overlaps in linear time relative to size of interaction sets rather than comparing all items.")
        content.append("3. **O(P log N) Ranking:** Instead of sorting all $P$ products in $O(P \log P)$ time, a Min-Heap (Priority Queue) maintains the top $N$ items. Since $N \\ll P$, this represents a major performance speedup.")

        # Ensure directory exists
        os.makedirs("outputs", exist_ok=True)
        
        filename = f"outputs/report_{user_id}.md"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write('\n'.join(content))
            
        return filename