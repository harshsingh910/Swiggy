import { useSelector, useDispatch } from "react-redux";


export default function Checkout() {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cartslice.items);

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-2xl mt-20 text-gray-600">
        🛒 Your cart is empty
      </div>
    );
  }

  const groupedByRestaurant = {};
  items.forEach(item => {
    const restaurant = item.restaurant || "Unknown Restaurant";
    if (!groupedByRestaurant[restaurant]) {
      groupedByRestaurant[restaurant] = [];
    }
    groupedByRestaurant[restaurant].push(item);
  });

  const deliveryFee = 47;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-10 px-4 sm:px-8">
      {Object.entries(groupedByRestaurant).map(([restaurantName, items]) => {
        const itemTotal = items.reduce((sum, item) => (sum + (item.price || 0) * item.quantity, 0))/100;
        const gst = parseFloat((itemTotal * 0.1).toFixed(2));
        const toPay = itemTotal + deliveryFee + gst;
        const savings = Math.round(itemTotal * 0.2); // pretend discount logic

        return (
          <div key={restaurantName} className="bg-white shadow-2xl rounded-xl p-6 max-w-4xl mx-auto space-y-8">
            
            {/* Restaurant Banner */}
            <div className="bg-orange-200 p-4 rounded-lg shadow-inner">
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-800">🍽️ {restaurantName}</h1>
              <p className="text-sm text-orange-700 mt-1">Delivering deliciousness at your doorstep</p>
            </div>

            {/* Items List */}
            <div className="space-y-6">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-yellow-50 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex space-x-4 items-center">
                    <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center text-2xl">
                      🍕
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                      <p className="text-gray-600">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => dispatch(DecrementItems(item))}
                      className="bg-red-200 hover:bg-red-300 text-red-800 font-bold rounded-full w-8 h-8"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(IncrementItems(item))}
                      className="bg-green-400 hover:bg-green-500 text-white font-bold rounded-full w-8 h-8"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-inner space-y-4">
              <h3 className="text-xl font-bold text-gray-800">🧾 Bill Details</h3>
              <div className="flex justify-between text-gray-700">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>GST (10%)</span>
                <span>₹{gst}</span>
              </div>

              {/* Savings */}
              <div className="flex justify-between text-green-600 font-semibold pt-2 border-t">
                <span>Savings</span>
                <span>-₹{savings}</span>
              </div>

              <div className="flex justify-between font-bold text-xl border-t pt-4">
                <span>TO PAY</span>
                <span>₹{(toPay - savings).toFixed(2)}</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-right">
              <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg">
                🚀 Place Order
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
