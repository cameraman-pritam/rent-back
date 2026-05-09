import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowBack,
  AddAPhoto,
  Close,
  Image as ImageIcon,
  VerifiedUser,
  AutoAwesome, // New Icon for the AI button
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useDb } from "../../context/dbContext";
import { useAI } from "../../context/aiContext"; // Import our AI hook
import { supabase } from "../../utils/supabase";
import Swal from "sweetalert2";

export default function AddItems() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRecord } = useDb();
  const { askAI, isLoading: isAiThinking } = useAI(); // Use the AI hook

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    gearName: "",
    category: "Photography",
    description: "",
    condition: "Excellent",
    transactionType: "Rent",
    price: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- AI MAGIC FILL LOGIC ---
  const handleMagicFill = async () => {
    if (!formData.gearName) {
      Swal.fire(
        "Wait!",
        "Enter the Gear Name first so the AI knows what to look for.",
        "info"
      );
      return;
    }

    const prompt = `
      I am listing gear for a rental app. 
      Gear Name: "${formData.gearName}"
      Transaction Type: "${formData.transactionType}"
      
      Please provide a JSON object with:
      1. "category" (Must be one of: Photography, Audio & Sound, Cinematography, Lighting, Drones)
      2. "description" (Professional, detailed technical description)
      3. "price" (A fair daily rental or sale price in INR/₹ based on 2026 market value)
      
      Return ONLY the JSON.
    `;

    const response = await askAI(prompt);

    if (response) {
      try {
        // Clean the response in case AI returns markdown code blocks
        const cleanedJson = response.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanedJson);

        setFormData((prev) => ({
          ...prev,
          category: data.category || prev.category,
          description: data.description || prev.description,
          price: data.price || prev.price,
        }));

        Swal.fire(
          "Magic Applied!",
          "Fields populated based on market data.",
          "success"
        );
      } catch (err) {
        console.error("Parse Error:", err);
        Swal.fire(
          "AI Error",
          "The AI sent a weird response. Try again.",
          "error"
        );
      }
    }
  };
  // ---------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      Swal.fire(
        "Hold up",
        "You need to be logged in to post gear, bro.",
        "error"
      );
      return;
    }

    if (!formData.gearName || !formData.price) {
      Swal.fire(
        "Missing Info",
        "Make sure you name the gear and set a price!",
        "warning"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let image_path = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("item-img")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("item-img")
          .getPublicUrl(fileName);

        image_path = publicUrlData.publicUrl;
      }

      const payload = {
        hoster_uid: user.id,
        item_name: formData.gearName,
        transaction_type: formData.transactionType,
        price: parseFloat(formData.price),
        condition: formData.condition,
        item_type: formData.category,
        description: formData.description,
        image_path: image_path,
      };

      await createRecord("items", payload);

      Swal.fire({
        title: "Massive W!",
        text: "Your gear is live and ready.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error("Submission L:", error.message);
      Swal.fire("Oops", "Something went wrong uploading your gear.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen relative overflow-hidden font-body">
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <nav className="h-20 flex items-center px-6 md:px-12 fixed top-0 w-full z-40 bg-surface/80 glass-panel">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowBack className="text-[18px]" />
            <span className="text-sm font-medium tracking-tight">
              Back to Dashboard
            </span>
          </button>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-on-surface">
              List New Gear
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl font-light">
              Enter the gear name and use our AI to automatically generate
              details.
            </p>
          </div>

          <button
            type="button"
            onClick={handleMagicFill}
            disabled={isAiThinking || !formData.gearName}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 disabled:grayscale"
          >
            <AutoAwesome className={isAiThinking ? "animate-spin" : ""} />
            <span className="font-bold text-sm">
              {isAiThinking ? "AI Thinking..." : "Magic Fill"}
            </span>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="p-8 rounded-xl bg-surface-container border border-dashed border-outline/30 hover:border-primary/40 transition-colors group text-center">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-6 text-primary">
              <AddAPhoto className="text-3xl" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-full bg-surface-container-highest text-primary font-semibold text-sm hover:bg-primary hover:text-on-primary transition-all"
            >
              {imagePreview ? "Change Image" : "Select Visual Assets"}
            </button>

            {imagePreview && (
              <div className="mt-6 flex justify-center">
                <div className="w-32 h-32 rounded-lg bg-surface-container-high overflow-hidden relative group/item">
                  <img
                    className="w-full h-full object-cover"
                    src={imagePreview}
                    alt="Preview"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-red-500"
                  >
                    <Close />
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="bg-surface-container rounded-xl p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-primary font-bold">
                  Gear Name
                </label>
                <input
                  name="gearName"
                  value={formData.gearName}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="e.g. Sony Alpha a7 IV"
                  className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-primary font-bold">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface outline-none"
                >
                  <option>Photography</option>
                  <option>Audio & Sound</option>
                  <option>Cinematography</option>
                  <option>Lighting</option>
                  <option>Drones</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-primary font-bold">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface outline-none resize-none"
              ></textarea>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-surface-container rounded-xl p-8">
              <label className="text-xs uppercase tracking-widest text-primary font-bold block mb-6">
                Condition
              </label>
              <div className="space-y-3">
                {["Mint", "Excellent", "Good", "Fair"].map((cond) => (
                  <label
                    key={cond}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                      formData.condition === cond
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-surface-container-high border border-transparent"
                    }`}
                  >
                    <span
                      className={
                        formData.condition === cond
                          ? "text-primary font-bold"
                          : "text-on-surface"
                      }
                    >
                      {cond}
                    </span>
                    <input
                      type="radio"
                      name="condition"
                      value={cond}
                      checked={formData.condition === cond}
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-8 flex flex-col justify-between">
              <div>
                <label className="text-xs uppercase tracking-widest text-primary font-bold block mb-6">
                  Type
                </label>
                <div className="flex p-1 bg-surface-container-high rounded-xl gap-1">
                  {["Rent", "Sell"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, transactionType: type })
                      }
                      className={`flex-1 py-3 rounded-lg font-bold text-sm ${
                        formData.transactionType === type
                          ? "bg-primary text-on-primary"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <label className="text-xs uppercase tracking-widest text-primary font-bold block mb-4">
                  Pricing (₹)
                </label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  className="w-full bg-surface-container-high border-none rounded-lg p-4 text-on-surface text-2xl outline-none"
                />
              </div>
            </div>
          </section>

          <footer className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-outline/10">
            <div className="flex items-center gap-3">
              <VerifiedUser className="text-primary text-[24px]" />
              <p className="text-xs text-on-surface-variant max-w-[240px]">
                Listing your gear is protected by our peer-to-peer insurance.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-12 py-4 rounded-full bg-primary text-on-primary font-bold shadow-xl hover:scale-105 transition-all"
            >
              {isSubmitting ? "Publishing..." : "Publish Listing"}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
