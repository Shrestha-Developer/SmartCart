import json

class Product:
    def __init__(self, product_id: str, name: str, category: str, price: float, tags: list, rating: float):
        self.id = product_id
        self.name = name
        self.category = category
        self.price = price
        self.tags = set(tags)  # Store as set for O(1) membership testing and set operations
        self.rating = rating

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            product_id=data["id"],
            name=data["name"],
            category=data["category"],
            price=data["price"],
            tags=data["tags"],
            rating=data["rating"]
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "price": self.price,
            "tags": list(self.tags),
            "rating": self.rating
        }

    def __repr__(self):
        return f"Product({self.id}, '{self.name}', Category={self.category}, Price=${self.price:.2f}, Rating={self.rating})"


class User:
    def __init__(self, user_id: str, name: str, purchase_history: list, search_history: list, cart: list, ratings: dict):
        self.id = user_id
        self.name = name
        self.purchase_history = set(purchase_history)  # Set for Jaccard similarity and duplicate prevention
        self.search_history = set(search_history)      # Set for content similarity calculations
        self.cart = list(cart)                         # Keep cart ordered
        self.ratings = {k: float(v) for k, v in ratings.items()}  # HashMap: Product ID -> User Rating

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            user_id=data["user_id"],
            name=data["name"],
            purchase_history=data["purchase_history"],
            search_history=data["search_history"],
            cart=data["cart"],
            ratings=data["ratings"]
        )

    def to_dict(self):
        return {
            "user_id": self.id,
            "name": self.name,
            "purchase_history": list(self.purchase_history),
            "search_history": list(self.search_history),
            "cart": self.cart,
            "ratings": self.ratings
        }

    def __repr__(self):
        return (f"User({self.id}, '{self.name}', Purchases={len(self.purchase_history)}, "
                f"SearchTags={len(self.search_history)}, CartCount={len(self.cart)})")