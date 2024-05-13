async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userdata = { username, password };
    try {
        const response = await axios.post('http://localhost:4000/login', userdata);
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            alert("Usuario logueado con éxito");
            window.location.href = "panelControl.html";
        } else {
            alert('Usuario y/o contraseña incorrectos');
        }
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
            alert('Usuario desactivado');
        } else {
            alert("Error al iniciar sesión");
        }
    }
}
