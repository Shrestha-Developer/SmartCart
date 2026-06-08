// Embedded initial datasets (mirrors data/products.json and data/users.json)
// Preempts CORS issues when opening index.html directly from local files (file:// protocol)
const INITIAL_PRODUCTS = [
  {
    "id": "P101",
    "name": "Wireless Noise-Canceling Headphones",
    "category": "Electronics",
    "price": 199.99,
    "tags": ["audio", "wireless", "music", "noise-canceling", "gadgets"],
    "rating": 4.8
  },
  {
    "id": "P102",
    "name": "Smart Fitness Watch",
    "category": "Electronics",
    "price": 149.99,
    "tags": ["wearable", "fitness", "smartwatch", "health", "wireless"],
    "rating": 4.5
  },
  {
    "id": "P103",
    "name": "Mechanical Gaming Keyboard",
    "category": "Electronics",
    "price": 89.99,
    "tags": ["gaming", "keyboard", "rgb", "computer", "accessories"],
    "rating": 4.7
  },
  {
    "id": "P104",
    "name": "Ultra HD LED Projector",
    "category": "Electronics",
    "price": 299.99,
    "tags": ["video", "projector", "home-theater", "wireless", "cinema"],
    "rating": 4.3
  },
  {
    "id": "P201",
    "name": "Premium Running Shoes",
    "category": "Fitness",
    "price": 119.99,
    "tags": ["sports", "running", "footwear", "shoes", "comfort"],
    "rating": 4.6
  },
  {
    "id": "P202",
    "name": "Ergonomic Office Chair",
    "category": "Home & Kitchen",
    "price": 249.99,
    "tags": ["furniture", "office", "chair", "ergonomic", "comfort"],
    "rating": 4.4
  },
  {
    "id": "P203",
    "name": "Stainless Steel Water Bottle",
    "category": "Fitness",
    "price": 24.99,
    "tags": ["bottle", "hydration", "sports", "eco-friendly", "outdoor"],
    "rating": 4.2
  },
  {
    "id": "P204",
    "name": "Yoga Mat with Carrying Strap",
    "category": "Fitness",
    "price": 29.99,
    "tags": ["fitness", "yoga", "exercise", "grip", "wellness"],
    "rating": 4.7
  },
  {
    "id": "P301",
    "name": "Python Algorithms & Data Structures",
    "category": "Books",
    "price": 45.00,
    "tags": ["books", "coding", "python", "programming", "education"],
    "rating": 4.9
  },
  {
    "id": "P302",
    "name": "Sapiens: A Brief History of Humankind",
    "category": "Books",
    "price": 18.50,
    "tags": ["books", "history", "philosophy", "science", "reading"],
    "rating": 4.8
  },
  {
    "id": "P303",
    "name": "Atomic Habits",
    "category": "Books",
    "price": 16.20,
    "tags": ["books", "self-help", "productivity", "psychology", "reading"],
    "rating": 4.9
  },
  {
    "id": "P401",
    "name": "Premium Blend Coffee Beans (1kg)",
    "category": "Home & Kitchen",
    "price": 32.00,
    "tags": ["beverage", "coffee", "organic", "kitchen", "morning"],
    "rating": 4.7
  },
  {
    "id": "P402",
    "name": "Electric Drip Coffee Maker",
    "category": "Home & Kitchen",
    "price": 59.99,
    "tags": ["appliance", "kitchen", "coffee", "brewer", "morning"],
    "rating": 4.3
  },
  {
    "id": "P501",
    "name": "Classic Denim Jacket",
    "category": "Fashion",
    "price": 75.00,
    "tags": ["clothing", "jacket", "denim", "unisex", "vintage"],
    "rating": 4.4
  },
  {
    "id": "P502",
    "name": "Leather Messenger Bag",
    "category": "Fashion",
    "price": 129.99,
    "tags": ["accessories", "bag", "leather", "office", "travel"],
    "rating": 4.6
  },
  {
    "id": "P503",
    "name": "Polarized Sports Sunglasses",
    "category": "Fashion",
    "price": 39.99,
    "tags": ["sunglasses", "eyewear", "sports", "polarized", "outdoor"],
    "rating": 4.5
  }
];

const INITIAL_USERS = [
  {
    "user_id": "U101",
    "name": "Alex (Tech Enthusiast)",
    "purchase_history": ["P101", "P103"],
    "search_history": ["audio", "wireless", "gaming", "gadgets"],
    "cart": ["P102"],
    "ratings": {
      "P101": 5.0,
      "P103": 4.0
    }
  },
  {
    "user_id": "U102",
    "name": "Sarah (Fitness & Health)",
    "purchase_history": ["P204", "P203"],
    "search_history": ["fitness", "yoga", "running", "hydration"],
    "cart": ["P201"],
    "ratings": {
      "P204": 5.0,
      "P203": 4.0
    }
  },
  {
    "user_id": "U103",
    "name": "David (Avid Reader)",
    "purchase_history": ["P302", "P303"],
    "search_history": ["books", "self-help", "productivity", "history"],
    "cart": ["P301"],
    "ratings": {
      "P302": 4.0,
      "P303": 5.0
    }
  },
  {
    "user_id": "U104",
    "name": "Emma (WFH Coffee Lover)",
    "purchase_history": ["P401", "P202"],
    "search_history": ["coffee", "office", "morning", "kitchen"],
    "cart": ["P402"],
    "ratings": {
      "P401": 5.0,
      "P202": 5.0
    }
  },
  {
    "user_id": "U105",
    "name": "General Shopper (Cold Start)",
    "purchase_history": ["P501"],
    "search_history": ["clothing", "shoes", "outdoor"],
    "cart": [],
    "ratings": {
      "P501": 4.0
    }
  }
];

// App Memory State (HashMap mapping IDs to Objects)
let productsMap = {};
let usersMap = {};
let activeUserId = "U101";
let chartInstance = null;

// Heap operation logs array
let heapTrace = [];

// ========================================================
// DSA Class: Min-Heap / Priority Queue implementation in JS
// ========================================================
class MinHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(i) { return Math.floor((i - 1) / 2); }
    getLeftChildIndex(i) { return 2 * i + 1; }
    getRightChildIndex(i) { return 2 * i + 2; }

    swap(i1, i2) {
        const temp = this.heap[i1];
        this.heap[i1] = this.heap[i2];
        this.heap[i2] = temp;
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    size() {
        return this.heap.length;
    }

    push(val) {
        // val format: { score: float, id: string, reason: string, collab: float, content: float, rating: float }
        this.heap.push(val);
        heapTrace.push(`[Heap Push] Inserted '${val.id}' with score ${val.score.toFixed(3)}`);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            heapTrace.push(`[Heap Pop] Root replaced by '${last.id}'. Bubbling down.`);
            this.bubbleDown(0);
        }
        return min;
    }

    bubbleUp(index) {
        let currentIndex = index;
        while (currentIndex > 0) {
            let parentIndex = this.getParentIndex(currentIndex);
            if (this.heap[currentIndex].score < this.heap[parentIndex].score) {
                heapTrace.push(`  👉 Swap Up: '${this.heap[currentIndex].id}' (score: ${this.heap[currentIndex].score.toFixed(3)}) with parent '${this.heap[parentIndex].id}' (score: ${this.heap[parentIndex].score.toFixed(3)})`);
                this.swap(currentIndex, parentIndex);
                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }

    bubbleDown(index) {
        let currentIndex = index;
        while (this.getLeftChildIndex(currentIndex) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(currentIndex);
            let rightChildIndex = this.getRightChildIndex(currentIndex);
            
            if (rightChildIndex < this.heap.length && 
                this.heap[rightChildIndex].score < this.heap[smallerChildIndex].score) {
                smallerChildIndex = rightChildIndex;
            }
            
            if (this.heap[currentIndex].score > this.heap[smallerChildIndex].score) {
                heapTrace.push(`  👉 Swap Down: '${this.heap[currentIndex].id}' (score: ${this.heap[currentIndex].score.toFixed(3)}) with child '${this.heap[smallerChildIndex].id}' (score: ${this.heap[smallerChildIndex].score.toFixed(3)})`);
                this.swap(currentIndex, smallerChildIndex);
                currentIndex = smallerChildIndex;
            } else {
                break;
            }
        }
    }
}

// ========================================================
// CORE ALGORITHMS
// ========================================================

// Jaccard similarity: |A ∩ B| / |A ∪ B|
function calculateJaccardSimilarity(setA, setB) {
    if (setA.size === 0 || setB.size === 0) return 0.0;
    
    let intersection = new Set([...setA].filter(x => setB.has(x)));
    let union = new Set([...setA, ...setB]);
    
    return intersection.size / union.size;
}

// User Collaborative candidates
function getCollaborativeCandidates(targetUser) {
    let candidates = {}; // HashMap: product_id -> score
    let targetPurchases = new Set(targetUser.purchase_history);
    
    for (let otherId in usersMap) {
        if (otherId === targetUser.user_id) continue;
        
        let otherUser = usersMap[otherId];
        let otherPurchases = new Set(otherUser.purchase_history);
        
        let sim = calculateJaccardSimilarity(targetPurchases, otherPurchases);
        
        if (sim > 0) {
            otherUser.purchase_history.forEach(prodId => {
                // Ignore products target user already bought or added to cart
                if (targetPurchases.has(prodId) || targetUser.cart.includes(prodId)) return;
                
                if (!candidates[prodId]) {
                    candidates[prodId] = 0.0;
                }
                
                // Weight score by other user's rating of that product
                let ratingVal = otherUser.ratings[prodId] || 4.0;
                candidates[prodId] += sim * (ratingVal / 5.0);
            });
        }
    }
    return candidates;
}

// Content-based similarity on search history & cart
function getContentCandidates(targetUser) {
    let candidates = {}; // HashMap: product_id -> score
    let targetPurchases = new Set(targetUser.purchase_history);
    let targetCart = new Set(targetUser.cart);
    
    // Aggregate user preference tags
    let userPrefTags = new Set(targetUser.search_history);
    targetUser.cart.forEach(cartId => {
        let item = productsMap[cartId];
        if (item) {
            item.tags.forEach(t => userPrefTags.add(t));
        }
    });

    if (userPrefTags.size === 0) return candidates;

    for (let prodId in productsMap) {
        if (targetPurchases.has(prodId) || targetCart.has(prodId)) continue;
        
        let product = productsMap[prodId];
        let productTags = new Set(product.tags);
        
        let sim = calculateJaccardSimilarity(userPrefTags, productTags);
        if (sim > 0) {
            candidates[prodId] = sim;
        }
    }
    return candidates;
}

// Hybrid Recommendation generating top-5 using Min-Heap
function generateRecommendations(userId, topN = 5) {
    let user = usersMap[userId];
    if (!user) return [];

    heapTrace = []; // Reset trace log
    heapTrace.push(`--- Starting recommendations for user ${user.name} ---`);
    
    let collabCands = getCollaborativeCandidates(user);
    let contentCands = getContentCandidates(user);
    
    let allCandidates = new Set([
        ...Object.keys(collabCands),
        ...Object.keys(contentCands)
    ]);
    
    // Cold start fallback: add highly rated items
    if (allCandidates.size === 0) {
        heapTrace.push("[Warm Start/Cold Start] No specific collab/content candidates found. Loading popular items.");
        for (let pid in productsMap) {
            if (!user.purchase_history.includes(pid) && !user.cart.includes(pid)) {
                allCandidates.add(pid);
            }
        }
    }

    let heap = new MinHeap();
    
    allCandidates.forEach(prodId => {
        let product = productsMap[prodId];
        if (!product) return;
        
        let collabScore = collabCands[prodId] || 0.0;
        let contentScore = contentCands[prodId] || 0.0;
        let ratingScore = product.rating / 5.0; // Normalized
        
        // Hybrid formula: 50% Collab, 30% Content, 20% Product Rating
        let hybridScore = (0.5 * collabScore) + (0.3 * contentScore) + (0.2 * ratingScore);
        
        // Reason tags
        let reason = "Top product recommendation";
        if (collabScore > 0 && contentScore > 0) {
            reason = "Matches search preference & popular among similar users";
        } else if (collabScore > 0) {
            reason = "Popular with shoppers of similar purchase taste";
        } else if (contentScore > 0) {
            reason = "Based on your search history or cart contents";
        } else {
            reason = "Highly-rated trending product";
        }
        
        let item = {
            id: prodId,
            score: hybridScore,
            reason: reason,
            collab: collabScore,
            content: contentScore,
            rating: ratingScore
        };
        
        if (heap.size() < topN) {
            heap.push(item);
        } else {
            // If current item is greater than the smallest in the heap, replace root
            if (hybridScore > heap.peek().score) {
                heapTrace.push(`[Heap Replace] Candidate '${prodId}' (score: ${hybridScore.toFixed(3)}) exceeds heap minimum '${heap.peek().id}' (score: ${heap.peek().score.toFixed(3)}). Replacing.`);
                heap.pop();
                heap.push(item);
            } else {
                heapTrace.push(`[Heap Skip] Candidate '${prodId}' (score: ${hybridScore.toFixed(3)}) is lower than heap minimum '${heap.peek().id}' (score: ${heap.peek().score.toFixed(3)}). Skipping.`);
            }
        }
    });
    
    // Retrieve items from heap
    let recs = [];
    while (heap.size() > 0) {
        recs.push(heap.pop());
    }
    
    // Sort descending
    recs.reverse();
    
    // Render heap logs
    document.getElementById("heapLogsText").innerText = heapTrace.join("\n");
    
    // Return recommendations
    return {
        recommendations: recs,
        heapArray: heap.heap // note: heap was emptied during pop, let's keep the ordered list
    };
}

// Get Jaccard Details table contents
function getJaccardDetails(userId) {
    let target = usersMap[userId];
    let rows = [];
    
    for (let oid in usersMap) {
        if (oid === userId) continue;
        let other = usersMap[oid];
        
        let targetSet = new Set(target.purchase_history);
        let otherSet = new Set(other.purchase_history);
        
        let intersection = new Set([...targetSet].filter(x => otherSet.has(x)));
        let union = new Set([...targetSet, ...otherSet]);
        let sim = calculateJaccardSimilarity(targetSet, otherSet);
        
        rows.push({
            name: other.name,
            targetCount: targetSet.size,
            otherCount: otherSet.size,
            intersection: Array.from(intersection).join(", ") || "∅",
            unionCount: union.size,
            score: sim
        });
    }
    return rows;
}

// ========================================================
// INITIALIZATION AND STATE CONTROLLERS
// ========================================================

function initData(reset = false) {
    if (reset || Object.keys(productsMap).length === 0) {
        productsMap = {};
        INITIAL_PRODUCTS.forEach(p => {
            // Keep tags as a Set in runtime HashMap memory
            productsMap[p.id] = { ...p, tags: new Set(p.tags) };
        });
    }
    
    if (reset || Object.keys(usersMap).length === 0) {
        usersMap = {};
        INITIAL_USERS.forEach(u => {
            // Keep collections as Set/Arrays in runtime HashMap memory
            usersMap[u.user_id] = {
                user_id: u.user_id,
                name: u.name,
                purchase_history: new Set(u.purchase_history),
                search_history: new Set(u.search_history),
                cart: [...u.cart],
                ratings: { ...u.ratings }
            };
        });
    }
}

// Show feedback toasts
function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Render Dashboard
function updateDashboard() {
    let activeUser = usersMap[activeUserId];
    
    // Update active badges
    document.getElementById("currentUserName").innerText = activeUser.name;
    
    // 1. Render Profile History
    let purchasesDiv = document.getElementById("userPurchases");
    purchasesDiv.innerHTML = activeUser.purchase_history.size === 0 ? '<span class="text-muted">None</span>' : "";
    activeUser.purchase_history.forEach(pid => {
        let prod = productsMap[pid];
        purchasesDiv.innerHTML += `<span class="tag-badge" title="${prod ? prod.name : ''}">${pid}</span>`;
    });
    
    let searchTagsDiv = document.getElementById("userSearchTags");
    searchTagsDiv.innerHTML = activeUser.search_history.size === 0 ? '<span class="text-muted">None</span>' : "";
    activeUser.search_history.forEach(tag => {
        searchTagsDiv.innerHTML += `<span class="tag-badge">${tag}</span>`;
    });
    
    let cartDiv = document.getElementById("userCart");
    cartDiv.innerHTML = activeUser.cart.length === 0 ? '<span class="text-muted">Empty</span>' : "";
    activeUser.cart.forEach(pid => {
        let prod = productsMap[pid];
        cartDiv.innerHTML += `<span class="tag-badge" title="${prod ? prod.name : ''}">${pid}</span>`;
    });
    
    // 2. Generate Recommendations and Heap
    let { recommendations: recs } = generateRecommendations(activeUserId, 5);
    
    // 3. Render Recs Grid
    let recsGrid = document.getElementById("recommendationsGrid");
    recsGrid.innerHTML = "";
    if (recs.length === 0) {
        recsGrid.innerHTML = `<p class="text-muted">No recommendations generated.</p>`;
    } else {
        recs.forEach((item, index) => {
            let p = productsMap[item.id];
            recsGrid.innerHTML += `
                <div class="rec-item">
                    <div class="rec-rank">#${index+1}</div>
                    <div class="rec-details">
                        <h4>${p.name}</h4>
                        <div class="rec-meta">
                            <span class="rec-category">${p.category}</span>
                            <span class="rec-price">$${p.price.toFixed(2)}</span>
                            <span class="rec-rating">⭐ ${p.rating}</span>
                        </div>
                        <div class="rec-reason">${item.reason}</div>
                    </div>
                    <div class="rec-score-box">
                        <span class="rec-percentage">${(item.score*100).toFixed(0)}%</span>
                        <div class="rec-pct-bar">
                            <div class="rec-pct-fill" style="width: ${Math.min(item.score*100, 100)}%"></div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    // 4. Update Chart.js Visualization
    renderChart(recs);
    
    // 5. Update Jaccard Table
    let jaccardData = getJaccardDetails(activeUserId);
    let jaccardBody = document.getElementById("jaccardTableBody");
    jaccardBody.innerHTML = "";
    jaccardData.forEach(row => {
        jaccardBody.innerHTML += `
            <tr>
                <td><strong>${row.name}</strong></td>
                <td>${row.targetCount} products</td>
                <td>${row.otherCount} products</td>
                <td><code>${row.intersection}</code></td>
                <td>${row.unionCount} items</td>
                <td><strong style="color: var(--accent-cyan)">${(row.score*100).toFixed(1)}%</strong></td>
            </tr>
        `;
    });

    // 6. Draw Heap graphical nodes representation
    renderHeapTree(recs);
}

// Draw Heap nodes
function renderHeapTree(recs) {
    let treeDiv = document.getElementById("heapTree");
    treeDiv.innerHTML = "";
    
    if (recs.length === 0) {
        treeDiv.innerHTML = "No nodes in heap.";
        return;
    }
    
    // We visualize heap as rows corresponding to levels: 
    // Row 0 (index 0), Row 1 (indices 1, 2), Row 2 (indices 3, 4)
    // Note: since heap is in order of priority, recs is sorted descending, 
    // but the heap array during calculation has parent-child structural ordering.
    // Let's draw nodes in level order representation:
    // P1 (Root)
    // /   \
    // P2   P3
    // / \
    // P4 P5
    // Note: since we popped from Min-Heap, we can simulate what the actual heap array would hold.
    // To make it look like a real binary heap structure, let's take the sorted items and 
    // place them in a heap layout structure:
    let level0 = recs.slice(0, 1);
    let level1 = recs.slice(1, 3);
    let level2 = recs.slice(3, 5);
    
    let makeRowHTML = (levelItems) => {
        let row = `<div class="heap-node-row">`;
        levelItems.forEach(item => {
            row += `
                <div class="heap-node" title="${productsMap[item.id].name}">
                    ${item.id}
                    <span>${item.score.toFixed(2)}</span>
                </div>
            `;
        });
        row += `</div>`;
        return row;
    };
    
    if (level0.length > 0) treeDiv.innerHTML += makeRowHTML(level0);
    if (level1.length > 0) treeDiv.innerHTML += makeRowHTML(level1);
    if (level2.length > 0) treeDiv.innerHTML += makeRowHTML(level2);
}

// Chart.js renderer
function renderChart(recs) {
    let ctx = document.getElementById('recsChart').getContext('2d');
    
    let labels = recs.map(item => item.id);
    let collabScores = recs.map(item => item.collab * 0.5);
    let contentScores = recs.map(item => item.content * 0.3);
    let ratingScores = recs.map(item => item.rating * 0.2);
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Collaborative filtering score (50%)',
                    data: collabScores,
                    backgroundColor: 'rgba(99, 102, 241, 0.75)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Content tag similarity score (30%)',
                    data: contentScores,
                    backgroundColor: 'rgba(6, 182, 212, 0.75)',
                    borderColor: 'rgba(6, 182, 212, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Base Product Rating score (20%)',
                    data: ratingScores,
                    backgroundColor: 'rgba(16, 185, 129, 0.75)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9ca3af' }
                },
                y: {
                    stacked: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9ca3af' },
                    max: 1.0
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#f3f4f6', boxWidth: 12, font: { size: 10 } }
                },
                tooltip: {
                    callbacks: {
                        afterBody: function(items) {
                            let total = 0;
                            items.forEach(item => total += item.raw);
                            return `Overall Hybrid Score: ${(total * 100).toFixed(1)}%`;
                        }
                    }
                }
            }
        }
    });
}

// Set up UI options and listeners
function setUpUI() {
    // 1. Build User persona sidebar selectors
    let userListDiv = document.getElementById("userList");
    userListDiv.innerHTML = "";
    
    for (let uid in usersMap) {
        let u = usersMap[uid];
        let btn = document.createElement("button");
        btn.className = `user-card-btn ${uid === activeUserId ? 'active' : ''}`;
        btn.id = `btnUser-${uid}`;
        btn.innerHTML = `
            <strong>${u.name}</strong>
            <span>ID: ${uid} | Purchases: ${u.purchase_history.size}</span>
        `;
        btn.onclick = () => {
            document.querySelectorAll(".user-card-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeUserId = uid;
            updateDashboard();
            showToast(`Switched active profile to ${u.name}`);
        };
        userListDiv.appendChild(btn);
    }
    
    // 2. Load products drop-down options in Sandbox
    let prodSelect = document.getElementById("productSelect");
    prodSelect.innerHTML = "";
    for (let pid in productsMap) {
        let p = productsMap[pid];
        prodSelect.innerHTML += `<option value="${pid}">${p.name} ($${p.price.toFixed(2)})</option>`;
    }
    
    // 3. Search action listener
    document.getElementById("btnSearch").onclick = () => {
        let searchInput = document.getElementById("searchInput");
        let query = searchInput.value.trim().toLowerCase();
        if (query) {
            usersMap[activeUserId].search_history.add(query);
            updateDashboard();
            showToast(`Simulated search: "${query}" - Recs updated!`);
            searchInput.value = "";
        } else {
            showToast("Please type a search query first!");
        }
    };
    
    // 4. Add to Cart listener
    document.getElementById("btnAddToCart").onclick = () => {
        let pid = prodSelect.value;
        let user = usersMap[activeUserId];
        
        if (user.purchase_history.has(pid)) {
            showToast(`User has already purchased this product.`);
            return;
        }
        
        if (!user.cart.includes(pid)) {
            user.cart.push(pid);
            updateDashboard();
            showToast(`Added ${productsMap[pid].name} to cart - Recs updated!`);
        } else {
            showToast("Product is already in shopping cart.");
        }
    };
    
    // 5. Checkout (Checkout buy) listener
    document.getElementById("btnCheckout").onclick = () => {
        let user = usersMap[activeUserId];
        if (user.cart.length === 0) {
            showToast("Your cart is empty! Add products to cart first.");
            return;
        }
        
        let cartItems = [...user.cart];
        cartItems.forEach(pid => {
            user.purchase_history.add(pid);
            user.ratings[pid] = 5.0; // Assume rating 5 for checkout purchase
        });
        user.cart = []; // clear cart
        
        updateDashboard();
        // Update user switcher badge count
        document.getElementById(`btnUser-${activeUserId}`).querySelector("span").innerText = 
            `ID: ${activeUserId} | Purchases: ${user.purchase_history.size}`;
            
        showToast(`Checkout complete! Purchased: ${cartItems.join(", ")}`);
    };
    
    // 6. Reset listener
    document.getElementById("btnResetUser").onclick = () => {
        initData(true); // reset
        setUpUI();
        updateDashboard();
        showToast("Profile data reset to initial configurations.");
    };
}

// Initial Bootup
window.onload = () => {
    initData();
    setUpUI();
    updateDashboard();
};