function getToken() {
    return localStorage.getItem('token');
}
async function traducirTexto(event) {
    event.preventDefault();
    const englishText = document.getElementById("englishTextarea").value;
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    try {
        const response = await axios.get(`http://localhost:4000/translate/${encodeURIComponent(englishText)}`, { headers: headers });
        const translatedText = response.data;
console.log(translatedText);

        document.getElementById("spanishTextarea").value = translatedText;

    } catch (error) {
        console.error(error);
        alert("Error en la traducción");
    }
}

