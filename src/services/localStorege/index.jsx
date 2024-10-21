
/**
 * Armazena um valor no localStorage sob uma chave específica.
 * @param {string} key - A chave para armazenar o valor.
 * @param {any} value - O valor a ser armazenado.
 */
export const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Erro ao armazenar o item no localStorage:", error);
    }
};

/**
 * Recupera um valor do localStorage usando uma chave específica.
 * @param {string} key - A chave do item a ser recuperado.
 * @returns {any|null} - O valor recuperado ou null se não existir.
 */
export const getItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Erro ao recuperar o item do localStorage:", error);
        return null;
    }
};

/**
 * Remove um item do localStorage usando uma chave específica.
 * @param {string} key - A chave do item a ser removido.
 */
export const logoutUser = (key) => {
    try {
        localStorage.logoutUser(key);
    } catch (error) {
        console.error("Erro ao remover o item do localStorage:", error);
    }
};
