import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Loader2,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { MenuItem } from "../backend.d";
import {
  useOrderHistory,
  usePlaceOrder,
  useRestaurants,
} from "../hooks/useQueries";

interface CartItem extends MenuItem {
  restaurantIdx: number;
  itemIdx: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  preparing: "bg-primary/15 text-primary border-primary/30",
  delivered: "bg-green-500/15 text-green-400 border-green-500/30",
};

export default function FoodPage() {
  const { data: restaurants = [], isLoading: loadingRestaurants } =
    useRestaurants();
  const { data: orderHistory = [], isLoading: loadingOrders } =
    useOrderHistory();
  const placeOrder = usePlaceOrder();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState<"browse" | "history">("browse");

  const addToCart = (item: MenuItem, rIdx: number, iIdx: number) => {
    setCart((prev) => [
      ...prev,
      { ...item, restaurantIdx: rIdx, itemIdx: iIdx },
    ]);
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const cartCount = cart.length;

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const rIdx = cart[0].restaurantIdx;
    const itemIds = cart.map((_, i) => BigInt(i));
    try {
      await placeOrder.mutateAsync({
        restaurantId: BigInt(rIdx),
        itemIds,
        deliveryAddress: address,
        paymentMode: "COD",
      });
      setCart([]);
      setAddress("");
      setCartOpen(false);
      toast.success("Order placed successfully! 🎉");
    } catch {
      toast.error("Failed to place order");
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 md:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              Food Delivery
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Order from top restaurants, pay on delivery
            </p>
          </div>
          <Button
            onClick={() => setCartOpen(true)}
            className="relative bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
            data-ocid="food.cart.button"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {(["browse", "history"] as const).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              data-ocid={`food.${tab}.tab`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab === "browse" ? "Browse Restaurants" : "Order History"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "browse" ? (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {loadingRestaurants ? (
                <div
                  className="flex justify-center py-16"
                  data-ocid="food.loading_state"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : restaurants.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="food.empty_state"
                >
                  No restaurants available
                </div>
              ) : (
                <div className="space-y-6">
                  {restaurants.map((restaurant, rIdx) => (
                    <motion.div
                      key={restaurant.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: rIdx * 0.1 }}
                      className="rounded-2xl border border-border bg-card card-glow overflow-hidden"
                      data-ocid={`food.restaurant.item.${rIdx + 1}`}
                    >
                      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {restaurant.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {restaurant.cuisine}
                          </p>
                        </div>
                        <Badge className="bg-chart-3/15 text-chart-3 border border-chart-3/30">
                          Open
                        </Badge>
                      </div>
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {restaurant.menu.map((item, iIdx) => (
                          <div
                            key={item.name}
                            className="flex items-start justify-between bg-secondary/40 rounded-xl p-3 border border-border"
                          >
                            <div className="flex-1 mr-3">
                              <div className="font-medium text-foreground text-sm">
                                {item.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {item.description}
                              </div>
                              <div className="text-primary font-semibold text-sm mt-1.5">
                                ₹{item.price.toFixed(2)}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addToCart(item, rIdx, iIdx)}
                              className="h-7 w-7 p-0 bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 shrink-0"
                              data-ocid="food.add.button"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {loadingOrders ? (
                <div
                  className="flex justify-center py-16"
                  data-ocid="food.history.loading_state"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : orderHistory.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="food.history.empty_state"
                >
                  No orders yet. Place your first order!
                </div>
              ) : (
                <div className="space-y-4">
                  {orderHistory.map((order, i) => (
                    <div
                      key={`${order.restaurantName}-${String(order.timestamp)}`}
                      className="rounded-2xl border border-border bg-card p-5"
                      data-ocid={`food.order.item.${i + 1}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-foreground">
                            {order.restaurantName}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {order.deliveryAddress}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(
                                Number(order.timestamp) / 1_000_000,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            COD
                          </Badge>
                          <Badge
                            className={`border ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.map((item) => item.name).join(", ")}
                      </div>
                      <div className="text-primary font-semibold mt-2">
                        ₹{order.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border z-50 flex flex-col"
              data-ocid="food.cart.panel"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Your Cart</h2>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  data-ocid="food.cart.close_button"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cart.length === 0 ? (
                  <div
                    className="text-center text-muted-foreground py-10"
                    data-ocid="food.cart.empty_state"
                  >
                    Cart is empty
                  </div>
                ) : (
                  cart.map((item, i) => (
                    <div
                      key={`cart-${item.name}-${i}`}
                      className="flex items-center justify-between bg-secondary/40 rounded-xl p-3 border border-border"
                      data-ocid={`food.cart.item.${i + 1}`}
                    >
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {item.name}
                        </div>
                        <div className="text-xs text-primary">
                          ₹{item.price.toFixed(2)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-5 border-t border-border space-y-3">
                <Input
                  placeholder="Delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-input border-border"
                  data-ocid="food.address.input"
                />
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold text-foreground">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                  <span>💵</span>
                  <span>Cash on Delivery</span>
                </div>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={placeOrder.isPending || cart.length === 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="food.order.submit_button"
                >
                  {placeOrder.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order (COD)"
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
