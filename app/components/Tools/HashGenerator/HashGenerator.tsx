"use client";
import React, { useState, useEffect } from "react";
import { ShieldCheck, Copy, Lock, Fingerprint } from "lucide-react";
import { toast } from "react-hot-toast";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({ md5: "", sha1: "", sha256: "" });

  // --- Optimized MD5 Implementation ---
  const md5 = (string: string) => {
    function k(n: number, s: number, t: number) {
      return ((n << s) | (n >>> (32 - s))) + t;
    }
    let b = [1732584193, 4023233417, 2562383102, 271733878],
      i,
      j,
      h = [0, 7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
    let s = unescape(encodeURIComponent(string)),
      n = s.length,
      m = [n << 3];
    for (i = 0; i < n; i++) m[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    m[(n + 4) >> 2] |= 128 << (((n + 4) % 4) << 3);
    for (i = 0; i < ((n + 12) >> 4) + 1; i++) {
      let a = b.slice();
      for (j = 0; j < 64; j++) {
        let f, g;
        if (j < 16) {
          f = (a[1] & a[2]) | (~a[1] & a[3]);
          g = j;
        } else if (j < 32) {
          f = (a[3] & a[1]) | (~a[3] & a[2]);
          g = (5 * j + 1) % 16;
        } else if (j < 48) {
          f = a[1] ^ a[2] ^ a[3];
          g = (3 * j + 5) % 16;
        } else {
          f = a[2] ^ (a[1] | ~a[3]);
          g = (7 * j) % 16;
        }
        let t = a[3];
        a[3] = a[2];
        a[2] = a[1];
        a[1] += k(
          a[0] +
            f +
            (m[i * 16 + g] || 0) +
            [
              -680876936, -389564586, 606105819, -1044525330, -176418897,
              1200080426, -1473231341, -45705983, 1770035416, -1958414417,
              -42063, -1990404162, 1804603682, -40341101, -1502002290,
              1236535329, -165796510, -1069501632, 643717713, -373897302,
              -701558691, 38016083, -660478335, -405537848, 568446438,
              -1019803690, -187363961, 1163531501, -1444681467, -51403784,
              1735328473, -1926607734, -378558, -2022574463, 1839030562,
              -35309556, -1530992060, 1272893353, -155497632, -1094730640,
              681279174, -358537222, -722521979, 76029189, -640364487,
              -421815835, 530742520, -995338651, -198630844, 1126891415,
              -1416354905, -57434055, 1700485571, -1894986606, -1051523,
              -2054922799, 1873313359, -30611744, -1560198380, 1309151649,
              -145523070, -1120210379, 718787280, -343485551,
            ][j],
          h[(j >> 4) * 4 + (j % 4)],
          0
        );
        a[0] = t;
      }
      for (j = 0; j < 4; j++) b[j] += a[j];
    }
    return b
      .map((x) =>
        (x >>> 0).toString(16).padStart(8, "0").match(/../g)!.reverse().join("")
      )
      .join("");
  };

  // --- Hashing Logic ---
  const computeHashes = async (str: string) => {
    if (!str) {
      setHashes({ md5: "", sha1: "", sha256: "" });
      return;
    }

    // MD5 (Local function)
    const m = md5(str);

    // SHA (Browser Native API)
    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    const sha1Buffer = await crypto.subtle.digest("SHA-1", data);
    const sha256Buffer = await crypto.subtle.digest("SHA-256", data);

    const toHex = (buf: ArrayBuffer) =>
      Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    setHashes({
      md5: m,
      sha1: toHex(sha1Buffer),
      sha256: toHex(sha256Buffer),
    });
  };

  useEffect(() => {
    computeHashes(input);
  }, [input]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
          Input String
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full h-32 p-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] font-mono text-sm focus:bg-white focus:border-[#5D5FEF]/20 outline-none transition-all shadow-inner"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          {
            label: "SHA-256",
            value: hashes.sha256,
            icon: <ShieldCheck className="text-emerald-500" />,
          },
          {
            label: "SHA-1",
            value: hashes.sha1,
            icon: <Fingerprint className="text-blue-500" />,
          },
          {
            label: "MD5",
            value: hashes.md5,
            icon: <Lock className="text-slate-400" />,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                  {item.label}
                </span>
              </div>
              {item.value && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.value);
                    toast.success(`${item.label} Copied!`);
                  }}
                  className="text-[10px] font-bold text-[#5D5FEF] uppercase hover:underline"
                >
                  Copy Hash
                </button>
              )}
            </div>
            <div className="bg-slate-50 p-4 rounded-xl font-mono text-xs break-all text-slate-600 border border-slate-100 min-h-[48px]">
              {item.value || (
                <span className="opacity-30 italic">Waiting for input...</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* 3. Security Badge */}
      <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
        <ShieldCheck size={16} /> Client-Side Only: Your data never leaves your
        computer
      </div>
    </div>
  );
}
