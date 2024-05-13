async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userdata = { username, password };
    try {
        const response = await axios.post('http://localhost:4000/login', userdata);
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            alert("Usuario logueado con exito");
            window.location.href = "panelControl.html";
            // return false;
        } else {
            alert('Usuario y/o contraseña incorrectos');
        }
    } catch (error) {
        console.error(error);
        alert("Error al iniciar sesion");
    }
}

