


async function crearUsuario() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const userdata = { username, password, nombre, apellido };

    try {
        const response = await fetch('http://localhost:4000/createuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userdata)
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            alert("Usuario creado con éxito");
        } else {
            throw new Error('Error al crear usuario');
        }
    } catch (error) {
        console.error(error);
        alert("Error al enviar los datos");
    }
}

