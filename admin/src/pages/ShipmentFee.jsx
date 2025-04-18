import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { backendUrl } from "../App";
import { Loader2, Coins, Truck } from "lucide-react";
import './Cart.css'

const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState("platform");
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-10">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Navigation Tabs */}
          <div className="w-full md:w-48 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab("platform")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === "platform"
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Coins size={18} />
              <span>Platform Fee</span>
            </button>
            <button
              onClick={() => setActiveTab("shipment")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === "shipment"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Truck size={18} />
              <span>Shipment Fee</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === "platform" ? <PlatformFee /> : <ShipmentFee token={token} />}
          </div>
        </div>
      </div>
    </div>
  );
};

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
      const res = await axios.post(
        `${backendUrl}/api/platform/set-platform-fee`,
        { fee: Number(fee) },
        { headers: { token } }
      );
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
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Coins className="text-yellow-500" size={28} />
        <h2 className="text-2xl font-semibold text-gray-800">Platform Fee Management</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Current Platform Fee
          </label>
          <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
            ₹{placeholderFee}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            New Platform Fee (₹)
          </label>
          <input
            type="number"
            placeholder="Enter new fee amount"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg transition font-semibold ${
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
            "Update Platform Fee"
          )}
        </button>
      </div>
    </div>
  );
};

const ShipmentFee = ({ token }) => {
  const [fee, setFee] = useState(200);
  const [loading, setLoading] = useState(false);
  const [currentFee, setCurrentFee] = useState("Loading...");

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/shipment/get-shipment-fee`, {
          headers: { token },
        });
        if (res.data.success) {
          setFee(res.data.fee);
          setCurrentFee(res.data.fee);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch shipment fee");
      }
    };
    fetchFee();
  }, []);

  const handleUpdate = async () => {
    if (fee === "") {
      toast("Please enter a fee to update.", { icon: "⚠️" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/shipment/set-shipment-fee`,
        { fee },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Shipment fee updated 🚛");
        setCurrentFee(fee);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating shipment fee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Truck className="text-blue-500" size={28} />
        <h2 className="text-2xl font-semibold text-gray-800">Shipment Fee Management</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Current Shipment Fee
          </label>
          <div className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
            ₹{currentFee}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            New Shipment Fee (₹)
          </label>
          <input
            type="number"
            placeholder="Enter new fee amount"
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg transition font-semibold ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Updating...
            </span>
          ) : (
            "Update Shipment Fee"
          )}
        </button>
      </div>
    </div>
  );
};

export default FeeManagement;