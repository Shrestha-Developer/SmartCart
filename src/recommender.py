import json
import heapq
from typing import List, Dict, Tuple, Set
from .models import Product, User

class RecommendationEngine:
    def __init__(self, products_json_path: str, users_json_path: str):
        self.products: Dict[str, Product] = {}  # HashMap: Product ID -> Product Object
        self.users: Dict[str, User] = {}        # HashMap: User ID -> User Object
        
        # Inverted Indexes for optimizing lookup complexities
        self.category_index: Dict[str, List[str]] = {} # HashMap: Category -> List of Product IDs
        self.tag_index: Dict[str, List[str]] = {}      # HashMap: Tag -> List of Product IDs
        
        self.load_data(products_json_path, users_json_path)

    def load_data(self, products_path: str, users_path: str):
        """Loads data from JSON and initializes HashMaps and Indexes."""
        # 1. Load products
        with open(products_path, 'r') as f:
            products_data = json.load(f)
            for item in products_data:
                p = Product.from_dict(item)
                self.products[p.id] = p
                
                # Build category index
                if p.category not in self.category_index:
                    self.category_index[p.category] = []
                self.category_index[p.category].append(p.id)
                
                # Build tag index
                for tag in p.tags:
                    if tag not in self.tag_index:
                        self.tag_index[tag] = []
                    self.tag_index[tag].append(p.id)

        # 2. Load users
        with open(users_path, 'r') as f:
            users_data = json.load(f)
            for item in users_data:
                u = User.from_dict(item)
                self.users[u.id] = u

    def get_product(self, product_id: str) -> Product:
        """O(1) product lookup using HashMap."""
        return self.products.get(product_id)

    def get_user(self, user_id: str) -> User:
        """O(1) user lookup using HashMap."""
        return self.users.get(user_id)

    def calculate_jaccard_similarity(self, set_a: Set, set_b: Set) -> float:
        """
        Calculates Jaccard Similarity between two sets.
        Formula: J(A, B) = |A ∩ B| / |A ∪ B|
        Time Complexity: O(len(A) + len(B)) average case using hashing.
        """
        if not set_a or not set_b:
            return 0.0
        intersection = len(set_a.intersection(set_b))
        union = len(set_a.union(set_b))
        return intersection / union if union > 0 else 0.0

    def get_collaborative_candidates(self, target_user: User) -> Dict[str, float]:
        """
        User-Based Collaborative Filtering candidates generation.
        1. Find similar users based on purchase history similarity.
        2. Gather products purchased by similar users that target_user hasn't bought or carted.
        3. Weight product score by user similarity.
        
        Time Complexity: O(U * (Purchases)) where U is number of users.
        """
        candidates = {}  # HashMap: Product ID -> Collaborative Score Sum
        
        for other_id, other_user in self.users.items():
            if other_id == target_user.id:
                continue
            
            # Calculate Jaccard similarity between purchase history sets
            sim = self.calculate_jaccard_similarity(
                target_user.purchase_history, 
                other_user.purchase_history
            )
            
            if sim > 0:
                # Add products purchased by this similar user
                for prod_id in other_user.purchase_history:
                    # Skip products the target user already interacted with (purchased or in cart)
                    if prod_id in target_user.purchase_history or prod_id in target_user.cart:
                        continue
                    
                    if prod_id not in candidates:
                        candidates[prod_id] = 0.0
                    # Weight score by user rating if available, or just the similarity
                    rating_weight = other_user.ratings.get(prod_id, 4.0) / 5.0 # normalized rating
                    candidates[prod_id] += sim * rating_weight
                    
        return candidates

    def get_content_candidates(self, target_user: User) -> Dict[str, float]:
        """
        Content-Based Filtering candidates generation.
        1. Accumulate target user's preference tags based on search history and items in cart.
        2. For all products (excluding purchased ones), calculate tag similarity.
        
        Time Complexity: O(P * T) where P is products and T is average tags per product.
        """
        candidates = {}
        
        # Accumulate search tags + tags from current cart products
        user_preference_tags = set(target_user.search_history)
        for cart_item_id in target_user.cart:
            cart_item = self.get_product(cart_item_id)
            if cart_item:
                user_preference_tags.update(cart_item.tags)
                
        if not user_preference_tags:
            return candidates

        for prod_id, product in self.products.items():
            # Skip if already purchased or in cart
            if prod_id in target_user.purchase_history or prod_id in target_user.cart:
                continue
                
            # Jaccard similarity between user preferences and product tags
            sim = self.calculate_jaccard_similarity(user_preference_tags, product.tags)
            if sim > 0:
                candidates[prod_id] = sim
                
        return candidates

    def generate_recommendations(self, user_id: str, top_n: int = 5) -> List[Tuple[str, float, str]]:
        """
        Generates hybrid recommendations for a user.
        Combines Collaborative Filtering and Content-based scores.
        Ranks products using a Min-Heap (Priority Queue) to get top N in O(P log N).
        
        Returns:
            List of tuples: (product_id, recommendation_score, reason)
        """
        target_user = self.get_user(user_id)
        if not target_user:
            return []

        # 1. Gather scores from both pipelines
        collab_candidates = self.get_collaborative_candidates(target_user)
        content_candidates = self.get_content_candidates(target_user)
        
        all_candidate_ids = set(collab_candidates.keys()).union(set(content_candidates.keys()))
        
        # 2. Fallback: If no matches, add popular products (highly rated products user hasn't bought)
        if not all_candidate_ids:
            for prod_id, product in self.products.items():
                if prod_id not in target_user.purchase_history and prod_id not in target_user.cart:
                    all_candidate_ids.add(prod_id)

        # Heap to track the top N recommendations
        # Since Python's heapq is a min-heap, we store elements as (score, product_id, reason).
        # We maintain a heap of size N. If a new element is larger than the root (smallest),
        # we pop the root and push the new element.
        min_heap = []
        
        for prod_id in all_candidate_ids:
            product = self.get_product(prod_id)
            if not product:
                continue
                
            collab_score = collab_candidates.get(prod_id, 0.0)
            content_score = content_candidates.get(prod_id, 0.0)
            
            # Hybrid Score formula: 50% Collaborative + 30% Content + 20% Product Rating
            rating_score = (product.rating / 5.0)  # Normalized to [0, 1]
            hybrid_score = (0.5 * collab_score) + (0.3 * content_score) + (0.2 * rating_score)
            
            # Determine reason
            if collab_score > 0 and content_score > 0:
                reason = "Similar users bought this & matches your search tags"
            elif collab_score > 0:
                reason = "Purchased by customers with similar taste"
            elif content_score > 0:
                reason = "Matches your search history and items in cart"
            else:
                reason = "Top trending product in store"
                
            # Maintain heap size top_n
            # Pushing a tuple (hybrid_score, prod_id, reason)
            # Python compares tuples element-by-element
            if len(min_heap) < top_n:
                heapq.heappush(min_heap, (hybrid_score, prod_id, reason))
            else:
                # If current score is greater than the smallest score in heap, replace it
                if hybrid_score > min_heap[0][0]:
                    heapq.heapreplace(min_heap, (hybrid_score, prod_id, reason))
                    
        # Extract from heap and sort in descending order
        # O(N log N) sorting where N is small (5 or 10)
        recommendations = []
        while min_heap:
            score, prod_id, reason = heapq.heappop(min_heap)
            recommendations.append((prod_id, score, reason))
            
        recommendations.reverse()  # Since popped from min-heap, reverse to get descending
        return recommendations

    def get_similar_products(self, product_id: str, top_n: int = 3) -> List[Tuple[str, float]]:
        """
        Finds similar products based on shared tags.
        Demonstrates content similarity between single items.
        
        Time Complexity: O(P * T)
        """
        target_prod = self.get_product(product_id)
        if not target_prod:
            return []
            
        min_heap = []
        for other_id, other_product in self.products.items():
            if other_id == product_id:
                continue
                
            sim = self.calculate_jaccard_similarity(target_prod.tags, other_product.tags)
            
            if len(min_heap) < top_n:
                heapq.heappush(min_heap, (sim, other_id))
            else:
                if sim > min_heap[0][0]:
                    heapq.heapreplace(min_heap, (sim, other_id))
                    
        similar = []
        while min_heap:
            sim, prod_id = heapq.heappop(min_heap)
            similar.append((prod_id, sim))
        similar.reverse()
        return similar

    def get_top_by_category(self, category: str, limit: int = 3) -> List[Product]:
        """
        O(C log C) where C is count of products in category.
        Uses category inverted index for instant fetching and custom sorting.
        """
        product_ids = self.category_index.get(category, [])
        products_in_cat = [self.get_product(pid) for pid in product_ids]
        
        # Sort based on rating descending
        products_in_cat.sort(key=lambda p: p.rating, reverse=True)
        return products_in_cat[:limit]
        
    def add_user_interaction(self, user_id: str, action_type: str, item_id: str):
        """
        Simulates user actions: updating the state of our user HashMap in O(1).
        action_type can be 'search_tag', 'cart', 'purchase', or 'rate'.
        """
        user = self.get_user(user_id)
        if not user:
            return False
            
        if action_type == 'search_tag':
            user.search_history.add(item_id.lower())
        elif action_type == 'cart':
            if item_id in self.products and item_id not in user.cart:
                user.cart.append(item_id)
        elif action_type == 'purchase':
            if item_id in self.products:
                user.purchase_history.add(item_id)
                # Remove from cart once purchased
                if item_id in user.cart:
                    user.cart.remove(item_id)
        elif action_type == 'rate':
            if item_id in self.products:
                # Update user ratings HashMap
                user.ratings[item_id] = float(5.0)  # assume 5 rating for simulated click-rate
        return True