import {
  Inspection,
  InspectionResult,
  AnswerValue,
  RISK_COLORS,
} from "@/types/inspection";
import * as ImageManipulator from "expo-image-manipulator";
import { getStatusLabel, formatDate, getScoreColor } from "./calculations";

const getAnswerLabel = (answer: AnswerValue | undefined): string => {
  switch (answer) {
    case "yes":
      return "Ya";
    case "doubt":
      return "Ragu";
    case "no":
      return "Tidak";
    default:
      return "Belum dijawab";
  }
};

const getAnswerColor = (answer: AnswerValue | undefined): string => {
  switch (answer) {
    case "yes":
      return "#22C55E";
    case "doubt":
      return "#EAB308";
    case "no":
      return "#EF4444";
    default:
      return "#94A3B8";
  }
};

const getModeLabel = (mode: string): string => {
  return mode === "buy"
    ? "Pengecekan untuk Membeli Mobil Bekas"
    : "Pengecekan Mobil Pribadi";
};

const getTransmissionLabel = (transmission: string | undefined): string => {
  if (!transmission) return "-";
  const labels: Record<string, string> = {
    manual: "Manual",
    automatic: "Otomatis",
  };
  return labels[transmission] || transmission;
};

const getRiskLabel = (risk: string | undefined): string => {
  if (!risk) return "-";
  const labels: Record<string, string> = {
    low: "Rendah",
    medium: "Sedang",
    high: "Tinggi",
    critical: "Kritis",
  };
  return labels[risk] || risk;
};

export const generateInspectionHTML = async (
  inspection: Inspection,
  result: InspectionResult,
  photos: { uri: string; question: string }[],
): Promise<string> => {
  const status = getStatusLabel(result.status);
  const modeLabel = getModeLabel(inspection.mode);

  const categorySections = (inspection.categories || [])
    .map((cat) => {
      const catScore = (result.categoryScores || []).find(
        (c) => c.categoryId === cat.id,
      );
      const scorePercent = catScore ? Math.round(catScore.percentage) : 0;
      const scoreColor = getScoreColor(scorePercent);

      const itemsHtml = (cat.items || [])
        .map(
          (item) => `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 10px; font-size: 12px; color: #1E293B;">${item.question || "-"}</td>
        <td style="padding: 10px; text-align: center;">
          <span style="
            background: ${getAnswerColor(item.answer)}20;
            color: ${getAnswerColor(item.answer)};
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          ">${getAnswerLabel(item.answer)}</span>
        </td>
        <td style="padding: 10px; text-align: center;">
          <span style="
            background: ${item.riskIndicator ? RISK_COLORS[item.riskIndicator] : "#94A3B8"}20;
            color: ${item.riskIndicator ? RISK_COLORS[item.riskIndicator] : "#94A3B8"};
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          ">${getRiskLabel(item.riskIndicator)}</span>
        </td>
        <td style="padding: 10px; font-size: 11px; color: #64748B;">${item.note || "-"}</td>
      </tr>
    `,
        )
        .join("");

      return `
      <div style="margin-bottom: 24px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #1E293B; margin: 0;">${cat.name}</h3>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 14px; font-weight: 700; color: ${scoreColor};">${scorePercent}%</span>
            <span style="font-size: 12px; color: #94A3B8;">(Bobot: ${Math.round((cat.weight || 0) * 100)}%)</span>
          </div>
        </div>
        <div style="background: white; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: #F8FAFC;">
              <tr>
                <th style="padding: 12px 10px; text-align: left; font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase;">Pertanyaan</th>
                <th style="padding: 12px 10px; text-align: center; font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; width: 80px;">Jawaban</th>
                <th style="padding: 12px 10px; text-align: center; font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; width: 80px;">Risiko</th>
                <th style="padding: 12px 10px; text-align: left; font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase;">Catatan</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
    })
    .join("");

  const criticalIssuesHtml =
    result.criticalIssues && result.criticalIssues.length > 0
      ? `
    <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <h3 style="font-size: 14px; font-weight: 700; color: #DC2626; margin: 0 0 12px 0;">⚠️ Masalah Kritis Terdeteksi</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${result.criticalIssues
          .map(
            (issue) => `
          <li style="font-size: 13px; color: #991B1B; margin-bottom: 6px;">${issue}</li>
        `,
          )
          .join("")}
      </ul>
    </div>
  `
      : "";

  const sellerIssuesHtml =
    result.sellerIssues && result.sellerIssues.length > 0
      ? `
    <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <h3 style="font-size: 14px; font-weight: 700; color: #D97706; margin: 0 0 12px 0;">⚠️ Ketidaksesuaian dengan Jawaban Penjual</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${result.sellerIssues
          .map(
            (issue) => `
          <li style="font-size: 13px; color: #92400E; margin-bottom: 6px;">${issue}</li>
        `,
          )
          .join("")}
      </ul>
    </div>
  `
      : "";

  const sellerTransparencyHtml = inspection.sellerTransparency
    ? `
    <div style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #E2E8F0;">
      <h3 style="font-size: 14px; font-weight: 700; color: #1E293B; margin: 0 0 12px 0;">Transparansi Penjual</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">${inspection.sellerTransparency.hasAccident ? "❌" : "✅"}</span>
          <span style="font-size: 13px; color: #64748B;">${inspection.sellerTransparency.hasAccident ? "Pernah tabrakan" : "Tidak pernah tabrakan"}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">${inspection.sellerTransparency.hasFlood ? "❌" : "✅"}</span>
          <span style="font-size: 13px; color: #64748B;">${inspection.sellerTransparency.hasFlood ? "Pernah banjir" : "Tidak pernah banjir"}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">${inspection.sellerTransparency.regularService ? "✅" : "❌"}</span>
          <span style="font-size: 13px; color: #64748B;">Servis rutin</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">${inspection.sellerTransparency.taxActive ? "✅" : "❌"}</span>
          <span style="font-size: 13px; color: #64748B;">Pajak aktif</span>
        </div>
      </div>
    </div>
  `
    : "";

  let photosHtml = "";

  if (photos && photos.length > 0) {
    const photosWithBase64 = await Promise.all(
      photos.map(async (p) => {
        try {
          let fileUri = p.uri;
          if (!fileUri.startsWith("file://") && !fileUri.startsWith("http")) {
            fileUri = "file://" + fileUri;
          }

          const manipResult = await ImageManipulator.manipulateAsync(
            fileUri,
            [{ resize: { width: 600 } }],
            {
              compress: 0.7,
              format: ImageManipulator.SaveFormat.JPEG,
              base64: true,
            },
          );

          return {
            base64: manipResult.base64,
            mimeType: "image/jpeg",
            question: p.question,
          };
        } catch (error) {
          console.error(`Gagal memproses foto untuk: ${p.question}`, error);
          return null;
        }
      }),
    );

    const validPhotos = photosWithBase64.filter((p) => p !== null);

    photosHtml = `
<div style="padding: 32px 40px;">
  <h2 style="font-size: 20px; font-weight: 700; color: #1E293B; margin-bottom: 16px;">
    Dokumentasi Foto
  </h2>

  <div style="display:grid; grid-template-columns: repeat(2,1fr); gap:16px;">
    ${validPhotos
      .map(
        (p) => `
      <div style="border:1px solid #E2E8F0; border-radius:12px; overflow:hidden;">
        <img src="data:${p?.mimeType};base64,${p?.base64}" style="width:100%; height:200px; object-fit:cover; display:block;" />
        <div style="padding:8px 12px;">
          <p style="font-size:12px; color:#64748B; margin:0;">${p?.question}</p>
        </div>
      </div>
    `,
      )
      .join("")}
  </div>
</div>
`;
  }

  // Jaga-jaga nilai null/undefined pakai fallback string kosong "" atau 0
  const brand = inspection.carData?.brand || "Mobil";
  const type = inspection.carData?.type || "Bekas";
  const year = inspection.carData?.year || "-";
  const color = inspection.carData?.color || "-";
  const mileage = Number(inspection.carData?.mileage || 0).toLocaleString(
    "id-ID",
  );
  const plateNumber = inspection.carData?.plateNumber || "-";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Laporan Pengecekan CARIFY</title>
  <style>
    @page { margin: 40px; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; color: #1E293B; }
    .page-break { page-break-after: always; }
  </style>
</head>
<body style="background: white;">
  <div style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); padding: 40px; text-align: center; color: white; border-radius: 0 0 24px 24px;">
    <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 8px 0;">CARIFY</h1>
    <p style="font-size: 14px; margin: 0; opacity: 0.9;">Smart Used Car Inspector</p>
    <div style="width: 60px; height: 4px; background: rgba(255,255,255,0.5); margin: 16px auto; border-radius: 2px;"></div>
    <p style="font-size: 12px; margin: 0; opacity: 0.8;">${modeLabel}</p>
  </div>

  <div style="padding: 32px 40px;">
    <div style="display: flex; gap: 32px; align-items: center; margin-bottom: 32px;">
      <div style="
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: conic-gradient(${getScoreColor(result.percentage)} ${result.percentage * 3.6}deg, #E2E8F0 0deg);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      ">
        <div style="
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        ">
          <span style="font-size: 32px; font-weight: 800; color: ${getScoreColor(result.percentage)};">${Math.round(result.percentage)}%</span>
          <span style="font-size: 11px; color: #64748B;">Skor Total</span>
        </div>
      </div>
      
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="font-size: 32px;">${status.emoji}</span>
          <div>
            <p style="font-size: 20px; font-weight: 700; color: ${status.color}; margin: 0;">${status.label}</p>
            ${result.hasCriticalIssue ? '<span style="font-size: 12px; color: #DC2626; font-weight: 600;">⚠️ Risiko Tinggi</span>' : ""}
          </div>
        </div>
        <p style="font-size: 13px; color: #64748B; margin: 0;">
          Dicek pada: ${formatDate(inspection.createdAt)}
        </p>
      </div>
    </div>

    <div style="background: #F8FAFC; border-radius: 16px; padding: 20px; margin-bottom: 32px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #1E293B; margin: 0 0 16px 0;">
        ${brand} ${type}
      </h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
        <div>
          <p style="font-size: 11px; color: #94A3B8; margin: 0 0 4px 0; text-transform: uppercase;">Tahun</p>
          <p style="font-size: 14px; font-weight: 600; color: #1E293B; margin: 0;">${year}</p>
        </div>
        <div>
          <p style="font-size: 11px; color: #94A3B8; margin: 0 0 4px 0; text-transform: uppercase;">Warna</p>
          <p style="font-size: 14px; font-weight: 600; color: #1E293B; margin: 0;">${color}</p>
        </div>
        <div>
          <p style="font-size: 11px; color: #94A3B8; margin: 0 0 4px 0; text-transform: uppercase;">Transmisi</p>
          <p style="font-size: 14px; font-weight: 600; color: #1E293B; margin: 0;">${getTransmissionLabel(inspection.carData?.transmission)}</p>
        </div>
        <div>
          <p style="font-size: 11px; color: #94A3B8; margin: 0 0 4px 0; text-transform: uppercase;">Kilometer</p>
          <p style="font-size: 14px; font-weight: 600; color: #1E293B; margin: 0;">${mileage} km</p>
        </div>
        <div>
          <p style="font-size: 11px; color: #94A3B8; margin: 0 0 4px 0; text-transform: uppercase;">Plat Nomor</p>
          <p style="font-size: 14px; font-weight: 600; color: #1E293B; margin: 0;">${plateNumber}</p>
        </div>
      </div>
    </div>

    ${criticalIssuesHtml}
    ${sellerIssuesHtml}
    ${sellerTransparencyHtml}

    <h2 style="font-size: 18px; font-weight: 700; color: #1E293B; margin: 0 0 16px 0;">Detail per Kategori</h2>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 32px;">
      ${(result.categoryScores || [])
        .map(
          (cat) => `
        <div style="background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; font-weight: 600; color: #1E293B;">${cat.categoryName}</span>
            <span style="font-size: 14px; font-weight: 700; color: ${getScoreColor(cat.percentage)};">${Math.round(cat.percentage)}%</span>
          </div>
          <div style="background: #E2E8F0; height: 6px; border-radius: 3px; overflow: hidden;">
            <div style="background: ${getScoreColor(cat.percentage)}; height: 100%; width: ${cat.percentage}%; border-radius: 3px;"></div>
          </div>
          <p style="font-size: 11px; color: #94A3B8; margin: 8px 0 0 0;">Bobot: ${Math.round((cat.weight || 0) * 100)}%</p>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>

  <div class="page-break"></div>

  ${photosHtml}

  <div style="padding: 32px 40px;">
    <h2 style="font-size: 20px; font-weight: 700; color: #1E293B; margin: 0 0 24px 0;">Detail Checklist Pengecekan</h2>
    ${categorySections}
  </div>

  <div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 20px 40px; border-top: 1px solid #E2E8F0; background: white;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 14px; font-weight: 700; color: #2563EB;">CARIFY</span>
        <span style="font-size: 12px; color: #94A3B8;">| Smart Used Car Inspector</span>
      </div>
      <div style="text-align: right;">
        <p style="font-size: 11px; color: #94A3B8; margin: 0;">Dokumen ini digenerate otomatis oleh CARIFY</p>
        <p style="font-size: 11px; color: #94A3B8; margin: 4px 0 0 0;">${formatDate(new Date().toISOString())}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export const generatePDFFilename = (inspection: Inspection): string => {
  const date = new Date(inspection.createdAt);
  const dateStr = date.toISOString().split("T")[0];
  const brand = (inspection.carData?.brand || "CAR").replace(/\s+/g, "_");
  const plate = (inspection.carData?.plateNumber || "XX").replace(/\s+/g, "");
  return `CARIFY_${brand}_${plate}_${dateStr}.pdf`;
};
