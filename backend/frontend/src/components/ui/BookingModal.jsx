import { useState } from "react";
import { bookingsAPI, paymentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingModal({ item, type = "hotel", onClose, onConfirm, placePrice = 0 }) {
  const { user, isLoggedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    specialRequest: "",
  });
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showMockCheckout, setShowMockCheckout] = useState(false);
  const [mockOrderInfo, setMockOrderInfo] = useState(null);

  const nights = formData.checkIn && formData.checkOut
    ? Math.max(1, Math.round((new Date(formData.checkOut) - new Date(formData.checkIn)) / 86400000))
    : 1;

  const stayTotal = item.isPlace ? (item.price || 0) : (item.price || 2000) * nights;
  const total = item.isPlace ? (item.price || 0) : stayTotal + (placePrice || 0);

  const handleConfirm = async () => {
    if (!isLoggedIn) {
      setError("Please log in to confirm booking.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        itemName: item.name,
        itemType: type,
        itemId: String(item.id || item._id),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        persons: Number(formData.guests),
        nights: Number(nights),
        total: Number(total),
        specialRequest: formData.specialRequest,
      };

      // 1. Create booking in pending status
      const bookingRes = await bookingsAPI.create(payload);
      const booking = bookingRes.booking;

      // 2. Generate Razorpay Order
      const order = await paymentAPI.createOrder({
        amount: total,
        bookingId: booking._id
      });

      // 3. Launch Payment Flow
      if (order.isMock) {
        setMockOrderInfo({ order, bookingId: booking._id });
        setShowMockCheckout(true);
      } else {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
        }

        const options = {
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          name: "Travelora",
          description: `Booking for ${item.name}`,
          order_id: order.id,
          handler: async (response) => {
            setSubmitting(true);
            setError("");
            try {
              await paymentAPI.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking._id
              });
              setConfirmed(true);
              if (onConfirm) onConfirm({ ...formData, item, total, nights });
            } catch (err) {
              setError(err.message || "Payment verification failed. Please contact support.");
            } finally {
              setSubmitting(false);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: "#10b981"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError(err.message || "Failed to initiate booking payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-500 text-sm mb-1">
            {item.name} · {nights} night{nights > 1 ? "s" : ""}
          </p>
          <p className="text-emerald-600 font-bold text-xl mb-6">₹{total.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mb-6">
            Confirmation will be sent to <span className="font-medium">{formData.email}</span>
          </p>
          <button onClick={onClose}
            className="w-full py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors">
            Done
          </button>
        </div>
      </ModalWrapper>
    );
  }

  if (showMockCheckout) {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="py-4 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-extrabold text-gray-800">Secure Payment Simulation</h3>
            <p className="text-xs text-gray-400 mt-1">Mock Payment Gateway powered by Razorpay Mock</p>
          </div>
          
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-800 font-medium">Amount to Pay</p>
              <p className="text-lg font-black text-emerald-600">₹{total.toLocaleString()}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">Test Mode</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Card Number</label>
              <input type="text" readOnly value="4111 1111 1111 1111" className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-500 outline-none"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Expiry Date</label>
                <input type="text" readOnly value="12/30" className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-500 outline-none"/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">CVV</label>
                <input type="password" readOnly value="123" className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-500 outline-none"/>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-semibold bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</p>
          )}

          <button
            onClick={async () => {
              setSubmitting(true);
              setError("");
              try {
                // Verify mock payment on backend
                await paymentAPI.verifyPayment({
                  razorpay_order_id: mockOrderInfo.order.id,
                  razorpay_payment_id: `pay_mock_${Date.now()}`,
                  razorpay_signature: "mock_signature_data",
                  bookingId: mockOrderInfo.bookingId
                });
                
                setConfirmed(true);
                setShowMockCheckout(false);
                if (onConfirm) onConfirm({ ...formData, item, total, nights });
              } catch (err) {
                setError(err.message || "Simulated payment verification failed.");
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={submitting}
            className="w-full py-3.5 bg-emerald-500 text-white font-extrabold rounded-2xl hover:bg-emerald-600 active:scale-95 shadow-md flex items-center justify-center gap-2 transition-all animate-pulse"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Processing...
              </>
            ) : (
              `Pay ₹${total.toLocaleString()} (Simulated)`
            )}
          </button>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper onClose={onClose}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {item.image && (
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"/>
        )}
        <div>
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-0.5">
            {type === "hotel" ? "Hotel Booking" : "Destination Booking"}
          </p>
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-400">{item.placeName || item.location}</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex gap-2 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? "bg-emerald-500" : "bg-gray-200"}`}/>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Select Dates & Guests</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Check-in</label>
              <input type="date" value={formData.checkIn} min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Check-out</label>
              <input type="date" value={formData.checkOut} min={formData.checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Guests</label>
            <select value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300 bg-white">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
            </select>
          </div>

          {/* Price preview */}
          <div className="bg-emerald-50 rounded-2xl p-4 space-y-2">
            {item.isPlace ? (
              <>
                {item.price > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Place entry + guide</span>
                    <span className="font-bold text-gray-700">₹{item.price.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Place entry</span>
                    <span className="font-bold text-emerald-600">FREE 🎉</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stay: ₹{(item.price||2000).toLocaleString()} × {nights} night{nights>1?"s":""}</span>
                  <span className="font-bold text-gray-700">₹{stayTotal.toLocaleString()}</span>
                </div>
                {placePrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Place entry fee</span>
                    <span className="font-bold text-gray-700">₹{placePrice.toLocaleString()}</span>
                  </div>
                )}
                {placePrice === 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Place entry</span>
                    <span className="font-bold text-emerald-600">FREE 🎉</span>
                  </div>
                )}
              </>
            )}
            <div className="border-t border-emerald-200 pt-2 flex justify-between">
              <span className="text-xs text-gray-400">Total (taxes included)</span>
              <span className="text-lg font-black text-emerald-700">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={() => setStep(2)} disabled={!formData.checkIn || !formData.checkOut}
            className="w-full py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Continue →
          </button>
          <button onClick={onClose}
            className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors">
            Not interested — maybe later
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Your Details</p>
          <input type="text" placeholder="Full Name" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
          <input type="email" placeholder="Email Address" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
          <input type="tel" placeholder="Phone Number" value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
          <textarea placeholder="Special requests (optional)" value={formData.specialRequest}
            onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300 h-20 resize-none"/>

          {/* Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-1">
            <div className="flex justify-between text-gray-500">
              <span>Check-in</span><span className="font-medium text-gray-700">{formData.checkIn}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Check-out</span><span className="font-medium text-gray-700">{formData.checkOut}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Guests</span><span className="font-medium text-gray-700">{formData.guests}</span>
            </div>
            <hr className="border-gray-200 my-2"/>
            <div className="flex justify-between font-bold text-gray-800">
              <span>Total</span><span className="text-emerald-600">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600 font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} disabled={submitting}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-2xl hover:bg-gray-50 transition-colors text-sm disabled:opacity-50">
              ← Back
            </button>
            <button onClick={handleConfirm} disabled={!formData.name || !formData.email || !formData.phone || submitting}
              className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {submitting ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-md bg-white rounded-[2rem] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
