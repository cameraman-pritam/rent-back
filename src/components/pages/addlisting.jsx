import React, { useState, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Added Storage imports
import { db, auth, storage } from "../../utils/firebase"; // Ensure 'storage' is exported from your config
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

const AddListing = () => {
  const toast = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // State for images

  const [formData, setFormData] = useState({
    title: "",
    category: "Tools",
    description: "",
    transactionType: "Rent",
    price: "",
    location: "",
    condition: "Like New",
  });

  // 🔹 Shared Styles
  const cardBase =
    "bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-slate-800/60 shadow-xl transition-all";
  const inputBase =
    "w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition";

  // 🔹 Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.current.show({
        severity: "warn",
        summary: "Limit Reached",
        detail: "Max 10 images allowed.",
        life: 3000,
      });
      return;
    }
    setSelectedFiles(files);
  };

  const uploadImages = async (uid) => {
    const urls = [];
    for (const file of selectedFiles) {
      const storageRef = ref(
        storage,
        `listings/${uid}/${Date.now()}-${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.price || !formData.location) {
      toast.current.show({
        severity: "warn",
        summary: "Hold Up",
        detail: "Title, Price, and Location are required.",
        life: 3000,
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.current.show({
        severity: "error",
        summary: "Access Denied",
        detail: "Log in to post your gear.",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Images first (if any)
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages(user.uid);
      }

      // 2. Prepare Final Data
      const finalData = {
        ...formData,
        title: formData.title.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        images: imageUrls, // Store the array of URLs
        uid: user.uid,
        userName: user.displayName || "Anonymous",
        userEmail: user.email,
        createdAt: serverTimestamp(),
      };

      // 3. Save to Firestore
      await addDoc(collection(db, "items"), finalData);

      toast.current.show({
        severity: "success",
        summary: "Item Live!",
        detail: "Your listing is officially on the grid.",
        life: 3000,
      });

      // Reset Form
      setFormData({
        title: "",
        category: "Tools",
        description: "",
        transactionType: "Rent",
        price: "",
        location: "",
        condition: "Like New",
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Glitch",
        detail: "Failed to upload. Check console.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="min-h-screen bg-inherit text-slate-200 font-sans p-6 md:p-12"
    >
      <Toast ref={toast} />

      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-5">
        <div>
          <p className="text-sky-400 font-bold tracking-widest uppercase text-xs mb-1">
            Digital Commons
          </p>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Drop New Gear
          </p>
        </div>
        <button className="text-slate-400 hover:text-white transition flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/50">
          <i className="pi pi-times-circle text-lg"></i>
          <span className="hidden md:inline font-semibold">Cancel</span>
        </button>
      </header>

      {/* Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        {/* Media Upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`${cardBase} md:col-span-5 flex flex-col justify-center items-center text-center cursor-pointer border-2 border-dashed ${
            selectedFiles.length > 0
              ? "border-sky-500 bg-sky-500/5"
              : "border-slate-700"
          } hover:border-sky-500/50 min-h-[280px]`}
        >
          <input
            type="file"
            hidden
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center mb-5">
            <i
              className={`pi ${
                selectedFiles.length > 0
                  ? "pi-check text-green-400"
                  : "pi-camera text-sky-400"
              } text-3xl`}
            ></i>
          </div>

          <p className="text-xl font-semibold text-white mb-1">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} Photos Added`
              : "Add Photos"}
          </p>
          <p className="text-slate-400 text-sm max-w-xs">
            {selectedFiles.length > 0
              ? "Click to change selection"
              : "Drag & drop or click to upload up to 10 images"}
          </p>
        </div>

        {/* Core Details */}
        <div className={`${cardBase} md:col-span-7 flex flex-col gap-5`}>
          <p className="text-lg font-semibold text-white">
            <i className="pi pi-box text-orange-400 mr-2"></i> Core Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">
                Item Title
              </label>
              <InputText
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={inputBase}
                placeholder="Sony A7III Camera"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">
                Category
              </label>
              <Dropdown
                value={formData.category}
                options={[
                  "Tools",
                  "Electronics",
                  "Outdoor Gear",
                  "Vehicle",
                  "Home Goods",
                ]}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.value })
                }
                className="w-full bg-slate-950 border-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Description
            </label>
            <InputTextarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputBase + " resize-none"}
              placeholder="What makes this item great?"
            />
          </div>
        </div>

        {/* Logistics */}
        <div className={`${cardBase} md:col-span-8`}>
          <p className="text-lg font-semibold text-white mb-5">
            <i className="pi pi-wallet text-sky-400 mr-2"></i> Logistics
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="text-sm text-slate-400 mb-1 block">
                Location
              </label>
              <div className="relative">
                <i className="pi pi-map-marker absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <InputText
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className={inputBase + " pl-10"}
                  placeholder="City or Zip"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className={inputBase + " pl-8"}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="text-sm text-slate-400 mb-2 block">
                Transaction Type
              </label>
              <div className="flex bg-slate-950 p-1 rounded-2xl gap-1">
                {["Rent", "Sell", "Share"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, transactionType: type })
                    }
                    className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${
                      formData.transactionType === type
                        ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Condition + CTA */}
        <div className="md:col-span-4 flex flex-col gap-5">
          <div className={`${cardBase}`}>
            <p className="text-lg font-semibold text-white mb-5">
              <i className="pi pi-check-square text-orange-400 mr-2"></i>{" "}
              Condition
            </p>
            <div className="grid grid-cols-2 gap-3">
              {["New", "Like New", "Good", "Fair"].map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: cond })}
                  className={`p-3 rounded-xl border text-sm font-semibold transition ${
                    formData.condition === cond
                      ? "border-orange-400 bg-orange-400/10 text-orange-400"
                      : "border-slate-800 text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !formData.title ||
              !formData.price ||
              !formData.location
            }
            className="w-full bg-gradient-to-r from-white to-sky-200 text-slate-950 rounded-[2rem] p-5 font-bold text-lg shadow-xl hover:shadow-sky-400/40 transition-all disabled:opacity-50 flex justify-between items-center"
          >
            {loading ? "Uploading..." : "Launch Listing"}
            <i
              className={`pi ${
                loading ? "pi-spin pi-spinner" : "pi-rocket"
              } text-xl`}
            ></i>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddListing;
