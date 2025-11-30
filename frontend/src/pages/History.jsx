// src/pages/History.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Icon } from "@iconify/react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:5000/history", {
        credentials: "include", // <-- penting untuk kirim cookie session
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
        }
        return;
      }

      const data = await response.json();
      setHistory(data); 
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };


  // Pagination
  const totalPages = Math.ceil(history.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = history.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

// --- tampilkan hanya 5 angka pagination ---
const getPageNumbers = () => {
  let pages = [];

  if (totalPages <= 5) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 3) {
      pages = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      pages = [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pages = [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ];
    }
  }

  return pages;
};

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-16 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">

          <div className="flex gap-6 items-start">
            {/* Navigasi kiri */}
            <div className="flex flex-col gap-3 min-w-[150px]">
              <Link
                to="/detection"
                className="px-6 py-2 rounded-full text-sm font-medium  
                border border-blue-400 text-blue-500 hover:bg-blue-50 text-center transition"
              >
                Detection
              </Link>

              <button
                disabled
                className="px-6 py-2 rounded-full text-sm font-medium
                bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-md"
              >
                History
              </button>
            </div>

            {/* Card Tabel */}
            <div className="flex-1">
            <h1 className="text-3xl md:text-[32px] font-semibold text-slate-900 mb-6">
                Detection <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">History</span>
            </h1>
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                {/* Header tabel */}
                <div className="grid grid-cols-5 bg-[#2B80FF] text-white font-medium text-sm py-4 px-6">
                  <div>Date</div>
                  <div>Total Acne</div>
                  <div>Severity Level</div>
                  <div>AI Recommendations</div>
                  <div className="text-center">Action</div>
                </div>

                {/* Isi tabel */}
                {currentData.length > 0 ? (
                  currentData.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-5 border-b border-slate-200 py-4 px-6 text-sm items-center bg-white hover:bg-slate-50 transition"
                    >
                      {/* waktu */}
                      <div>{row.waktu}</div>

                      {/* jumlah jerawat */}
                      <div>{row.jumlah_jerawat}</div>

                      {/* tingkat keparahan */}
                      <div>{row.tingkat_keparahan}</div>

                      {/* analisa (truncate) */}
                      <div className="truncate max-w-[260px] text-slate-600">
                        {row.analisa}
                      </div>

                      {/* action: download PDF */}
                      <div className="text-center">
                        {row.pdf_url ? (
                            <a
                            href={row.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-blue-400 text-blue-500 hover:bg-blue-50 transition"
                            title="Download PDF"
                            >
                            <Icon icon="solar:download-linear" className="text-xl" />
                            </a>
                        ) : (
                            <span className="text-slate-400 text-xs">No PDF</span>
                        )}
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-slate-500 text-sm">
                    Belum ada riwayat deteksi.
                  </div>
                )}

                {/* Footer: info + pagination */}
                <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
                  <span className="text-slate-600">
                    Menampilkan {currentData.length} dari {history.length}
                  </span>

                  <div className="flex gap-2">
                    {getPageNumbers().map((page) => (
                        <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md border text-sm ${
                            currentPage === page
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                        >
                        {page}
                        </button>
                    ))}

                    {currentPage < totalPages && (
                        <button
                        onClick={handleNext}
                        className="px-4 py-1 rounded-md bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                        >
                        Selanjutnya
                        </button>
                    )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}