import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { backendUrl } from "../App";
import { Loader2, Coins } from "lucide-react";
import './Cart.css'

const PlatformFee = () => {
  const [fee, setFee] = useState("");
  const [placeholderFee, setPlaceholderFee] = useState("Loading...");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPlatformFee = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/platform/get-platform-fee`);
        if (res.data.success) {
          setPlaceholderFee(res.data.fee);
        } else {
          toast.error("Failed to fetch platform fee");
        }
      } catch (err) {
        toast.error("Error fetching platform fee");
        console.error(err);
      }
    };

    fetchPlatformFee();
  }, []);

  const handleUpdate = async () => {
    if (fee === "") {
      toast("Please enter a fee to update.", { icon: "⚠️" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/platform/set-platform-fee`,{
        headers: { token },
      }, { fee: Number(fee) });
      if (res.data.success) {
        toast.success("Platform fee updated 🎉");
        setPlaceholderFee(fee);
        setFee("");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error updating platform fee");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <Toaster />
      <div className="bg-gradient-to-br from-gray-50 to-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Coins className="text-yellow-500" size={28} />
          <h2 className="text-2xl font-semibold text-gray-800">
            Platform Fee Management
          </h2>
        </div>

        <label className="block text-sm font-medium text-gray-600 mb-1">
          Platform Fee (₹)
        </label>
        <input
          type="number"
          placeholder={placeholderFee}
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`w-full py-2 text-white rounded-lg transition font-semibold ${
            loading
              ? "bg-yellow-300 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Updating...
            </span>
          ) : (
            "Update Fee"
          )}
          {/* */}
        </button>
      </div>
    </div>
  );
};


export default PlatformFee;
// 

// 