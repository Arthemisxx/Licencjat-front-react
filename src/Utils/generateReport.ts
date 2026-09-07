import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import type {AdminReportDetailsData} from "../types/report.ts";

(pdfMake as any).vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : (pdfFonts as any).vfs;
export const generateReportPDF = async (report: AdminReportDetailsData) => {
    if (!report) return;

    try {

        const imagesBase64 = [];
        if (report.imageUrls) {
            for (const url of report.imageUrls) {
                try {
                    const b64 = await getBase64ImageFromURL(url);
                    imagesBase64.push(b64);
                } catch (e) {
                    console.error("Nie udało się załadować zdjęcia do PDF:", url);
                }
            }
        }

        const docDefinition: TDocumentDefinitions = {
            content: [
                { text: `RAPORT ZGŁOSZENIA #${report.id}`, fontSize: 20, bold: true, color: '#00adee', margin: [0, 0, 0, 10] },
                { text: `Kategoria: ${report.categoryName} | Status: ${report.status}`, fontSize: 12, margin: [0, 0, 0, 20] },

                { text: 'OPIS ZGŁOSZENIA', style: 'sectionHeader' },
                { text: report.description, margin: [0, 0, 0, 20] },

                { text: 'LOKALIZACJA', style: 'sectionHeader' },
                { text: `Adres: ${report.address || 'Brak danych'}`, margin: [0, 0, 0, 5] },
                { text: `Długość geograficzna: ${report.longitude || 'Brak danych'}`, margin: [0, 0, 0, 5] },
                { text: `Szerokość geograficzna: ${report.latitude || 'Brak danych'}`, margin: [0, 0, 0, 5] },



                { text: 'DANE OSOBOWE', style: 'sectionHeader' },
                { text: `Zgłaszający: ${report.authorName || "Anonimowy"}`, margin: [0, 0, 0, 20] },

                { text: 'DOKUMENTACJA FOTOGRAFICZNA', style: 'sectionHeader' },

                imagesBase64.length > 0 ? {
                    columns: imagesBase64.map(img => ({
                        image: img,
                        width: 200,
                        margin: [5, 5]
                    })),
                    columnGap: 10
                } : { text: 'Brak zdjęć w zgłoszeniu.', italics: true, color: 'gray' }
            ],
            styles: {
                sectionHeader: {
                    fontSize: 14,
                    bold: true,
                    fillColor: '#ececec',
                    margin: [0, 15, 0, 5],
                    padding: [5, 5]
                }
            },
            defaultStyle: {
                fontSize: 11
            }
        };

        (pdfMake as any).createPdf(docDefinition).download(`Raport_${report.id}.pdf`);
    } catch (error) {
        console.error("Błąd podczas generowania PDF:", error);
        alert("Wystąpił błąd podczas generowania PDF.");
    }
};



const getBase64ImageFromURL = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
        img.src = url;
    });
};