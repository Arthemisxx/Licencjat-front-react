export const fetchAddressFromCoords = async (lat: number, lng: number): Promise<string | null> => {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'pl'
            }
        });

        if (!response.ok) {
            throw new Error("Błąd geokodowania");
        }

        const data = await response.json();
        const address = data.address;
        if (!address) return null;

        const city = address.city || address.town || address.village || address.hamlet || address.municipality || "";
        const road = address.road || "";
        const houseNumber = address.house_number || "";
        const streetWithNumber = houseNumber ? `${road} ${houseNumber}`.trim() : road;
        const name = city ? (streetWithNumber ? `${streetWithNumber}, ${city}` : city) : streetWithNumber;

        return (name || "Nieznana lokalizacja");

    } catch (error) {
        console.error("Błąd pobierania adresu:", error);
        return null;
    }
};