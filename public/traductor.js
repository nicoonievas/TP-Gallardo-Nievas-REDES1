async function traducirTexto(event) {
    event.preventDefault();
    const englishText = document.getElementById("englishTextarea").value;

    try {
        const response = await axios.get(`http://localhost:4000/translate/${encodeURIComponent(englishText)}`);
        const translatedText = response.data;
console.log(translatedText);

        document.getElementById("spanishTextarea").value = translatedText;

    } catch (error) {
        console.error(error);
        alert("Error en la traducción");
    }
}

