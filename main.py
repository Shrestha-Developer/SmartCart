import sys
import os
from src.recommender import RecommendationEngine
from src.report_generator import ReportGenerator

def print_header(text: str):
    print("\n" + "=" * 60)
    print(f" {text} ".center(60, "="))
    print("=" * 60)

def print_table_row(cols, widths):
    row = ""
    for col, width in zip(cols, widths):
        row += f"{str(col):<{width}} | "
    print(row[:-3])

def main():
    # Instantiate recommender engine
    products_path = "data/products.json"
    users_path = "data/users.json"
    
    if not os.path.exists(products_path) or not os.path.exists(users_path):
        print("Error: Missing datasets in 'data/' directory. Make sure you generated products.json and users.json first.")
        sys.exit(1)
        
    engine = RecommendationEngine(products_path, users_path)

    # Set default active user
    active_user_id = "U101"

    # Automated run mode
    if os.getenv("AUTO_RUN") == "1":
        # Generate recommendations
        user = engine.get_user(active_user_id)
        recs = engine.generate_recommendations(user.id, top_n=5)
        # Print recommendations
        print_header(f"Automated Recommendations for {user.name}")
        for rank, (prod_id, score, reason) in enumerate(recs, 1):
            prod = engine.get_product(prod_id)
            print(f"{rank}. {prod.name} (Score: {score:.2f})")
        # Export report
        ReportGenerator.generate_user_report(engine, active_user_id)
        print("Automated run completed.")
        sys.exit(0)

    while True:
        user = engine.get_user(active_user_id)
        print_header(f"E-Commerce Recommendation Engine Console (Active: {user.name})")
        print("1. Switch Active User Persona")
        print("2. View Active User Profile details")
        print("3. Run Hybrid Recommendation Engine (Heap-Ranked)")
        print("4. Simulate User Actions (Search tags / Add to Cart / Purchase)")
        print("5. View Product Catalog")
        print("6. Export Markdown Report")
        print("7. Exit")
        
        choice = input("\nSelect an option (1-7): ").strip()
        
        if choice == "1":
            print_header("Switch User Persona")
            print("Available users:")
            widths = [8, 25, 20]
            print_table_row(["ID", "Name", "Purchases Count"], widths)
            print("-" * 60)
            for uid, u in engine.users.items():
                print_table_row([u.id, u.name, len(u.purchase_history)], widths)
                
            new_uid = input("\nEnter User ID to switch to: ").strip()
            if new_uid in engine.users:
                active_user_id = new_uid
                print(f"\nSwitched successfully to: {engine.get_user(active_user_id).name}")
            else:
                print("\nInvalid User ID!\n")
                
        elif choice == "2":
            user = engine.get_user(active_user_id)
            print_header(f"User Profile: {user.name}")
            print(f"User ID:           {user.id}")
            print(f"Purchases:         {list(user.purchase_history)}")
            print(f"Search Tags:       {list(user.search_history)}")
            print(f"Shopping Cart:     {user.cart}")
            print(f"Product Ratings:   {user.ratings}")
            input("\nPress Enter to continue...")
            
        elif choice == "3":
            user = engine.get_user(active_user_id)
            print_header(f"Recommendations for {user.name}")
            
            print("\nCalculating Collaborative & Content scores...")
            recs = engine.generate_recommendations(user.id, top_n=5)
            
            if not recs:
                print("No recommendations found.")
            else:
                widths = [5, 12, 35, 12, 12]
                print_table_row(["Rank", "ID", "Product Name", "Score", "Reason"], widths)
                print("-" * 80)
                for rank, (prod_id, score, reason) in enumerate(recs, 1):
                    prod = engine.get_product(prod_id)
                    if prod:
                        # Truncate reason if too long
                        disp_reason = reason[:30] + "..." if len(reason) > 30 else reason
                        print_table_row([rank, prod.id, prod.name, f"{score*100:.1f}%", disp_reason], widths)
            
            # Show similar items to cart
            if user.cart:
                print("\n💡 Cart Similarity Insights:")
                for item_id in user.cart:
                    similars = engine.get_similar_products(item_id, top_n=2)
                    prod = engine.get_product(item_id)
                    print(f" - Similar to '{prod.name}' in cart:")
                    for sim_id, sim_score in similars:
                        sim_p = engine.get_product(sim_id)
                        print(f"    👉 [{sim_p.id}] {sim_p.name} - Similarity: {sim_score*100:.1f}%")
            input("\nPress Enter to continue...")
            
        elif choice == "4":
            print_header("Simulate User Action")
            print("1. 🔍 Add search term/tag")
            print("2. 🛒 Add product to cart")
            print("3. 💳 Complete checkout (Purchase cart items)")
            act = input("Select simulation (1-3): ").strip()
            
            if act == "1":
                tag = input("Enter search query/tag (e.g. running, wireless, books): ").strip()
                if tag:
                    engine.add_user_interaction(active_user_id, 'search_tag', tag)
                    print(f"\nAdded search history tag: '{tag}'")
                    
            elif act == "2":
                print("\nAvailable Products:")
                for pid, p in engine.products.items():
                    print(f"[{p.id}] {p.name} (${p.price:.2f})")
                pid = input("\nEnter Product ID to add to cart: ").strip().upper()
                if pid in engine.products:
                    engine.add_user_interaction(active_user_id, 'cart', pid)
                    print(f"\nAdded '{engine.products[pid].name}' to cart!")
                else:
                    print("\n❌ Invalid Product ID!")
                    
            elif act == "3":
                user = engine.get_user(active_user_id)
                if not user.cart:
                    print("\n🛒 Cart is empty! Add items first.")
                else:
                    # Purchase all items in cart
                    cart_items = list(user.cart)
                    for item_id in cart_items:
                        engine.add_user_interaction(active_user_id, 'purchase', item_id)
                    print(f"\nSuccess! Purchased items: {cart_items}")
            
            input("\nPress Enter to continue...")
            
        elif choice == "5":
            print_header("Product Catalog")
            widths = [8, 35, 15, 10, 8]
            print_table_row(["ID", "Name", "Category", "Price", "Rating"], widths)
            print("-" * 80)
            for pid, p in engine.products.items():
                print_table_row([p.id, p.name, p.category, f"${p.price:.2f}", p.rating], widths)
            input("\nPress Enter to continue...")
            
        elif choice == "6":
            print_header("Exporting Report")
            filepath = ReportGenerator.generate_user_report(engine, active_user_id)
            print(f"\nReport successfully generated and written to:")
            print(f"👉 {os.path.abspath(filepath)}")
            input("\nPress Enter to continue...")
            
        elif choice == "7":
            print("\nThank you for using the E-Commerce Recommendation Engine! Bye!\n")
            break
        else:
            print("\n❌ Invalid choice, please try again.")

if __name__ == "__main__":
    main()