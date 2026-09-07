import { useEffect, useState } from "react";
import { fetchAdminCategories, createAdminCategory, deleteAdminCategory } from "../../Utils/api.ts";
import '../style/AdminPanelView.css';
import type { AdminCategory } from "../../types/category.ts";

export const AdminPanelCategories = () => {
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [newCategoryName, setNewCategoryName] = useState<string>("");

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAdminCategories();
            setCategories(data);
        } catch (error) {
            console.error("Błąd pobierania kategorii:", error);
            showToast("Nie udało się pobrać kategorii");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleAddCategory = async () => {
        const trimmedName = newCategoryName.trim();
        if (!trimmedName) {
            showToast("Nazwa kategorii nie może być pusta");
            return;
        }

        try {
            await createAdminCategory(trimmedName);
            showToast(`Dodano kategorię: ${trimmedName}`);
            setNewCategoryName("");
            loadCategories();
        } catch (error) {
            console.error("Błąd dodawania kategorii:", error);
            showToast("Wystąpił błąd podczas dodawania");
        }
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            await deleteAdminCategory(id);
            showToast("Kategoria została usunięta");
            loadCategories();
        } catch (error) {
            console.error("Błąd usuwania kategorii:", error);
            showToast("Błąd: Upewnij się, że kategoria nie ma przypisanych zgłoszeń.");
        }
    };

    return (
        <>
            <div className="admin-toolbar">
                <div></div>

                <div
                    className="admin-search"
                    style={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}
                >
                    <input
                        type="text"
                        placeholder="Wpisz nazwę nowej kategorii..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        style={{
                            width: '300px',
                            border: '1px solid var(--color-secondary-blue)'
                        }}
                    />
                    <button
                        className="btn-add-new"
                        onClick={handleAddCategory}
                        disabled={!newCategoryName.trim()}
                        style={{
                            minWidth: '150px'
                        }}
                    >
                        Dodaj kategorię
                    </button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th style={{ width: '70%' }}>Nazwa kategorii</th>
                        <th className="th-actions" style={{ width: '20%' }}>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={3} style={{ textAlign: 'center' }}>Ładowanie kategorii...</td>
                        </tr>
                    ) : categories.length === 0 ? (
                        <tr>
                            <td colSpan={3} style={{ textAlign: 'center' }}>Brak kategorii w bazie.</td>
                        </tr>
                    ) : (
                        categories.map(category => (
                            <tr key={category.id}>

                                <td style={{ fontWeight: 'bold', fontSize: '15px' }}>
                                    {category.name}
                                </td>
                                <td className="td-actions">
                                    <button
                                        className="btn-action delete"
                                        onClick={() => handleDeleteCategory(category.id)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: '2px solid var(--color-primary-magenta)',
                                            color: 'var(--color-text-main-black)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--color-primary-magenta)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Usuń
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {toastMessage && (
                <div className="custom-toast">
                    {toastMessage}
                </div>
            )}
        </>
    );
};